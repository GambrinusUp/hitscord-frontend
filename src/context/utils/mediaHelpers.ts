import { Device } from 'mediasoup-client';
import { Consumer, ConsumerOptions } from 'mediasoup-client/lib/Consumer';
import { Producer } from 'mediasoup-client/lib/Producer';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Transport, TransportOptions } from 'mediasoup-client/lib/Transport';
import { Socket } from 'socket.io-client';

import socket from '../../api/socket';

export const getLocalAudioStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      noiseSuppression: true,
      echoCancellation: false,
      autoGainControl: false,
    },
  });
  return stream.getAudioTracks()[0];
};

export const joinRoom = async (roomName: string, userName: string) => {
  return new Promise<RtpCapabilities>((resolve, reject) => {
    socket.emit(
      'joinRoom',
      { roomName, userName },
      (response: { rtpCapabilities: RtpCapabilities; error?: string }) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.rtpCapabilities);
        }
      }
    );
  });
};

export const createDevice = async (rtpCapabilities: RtpCapabilities) => {
  const device = new Device();
  await device.load({ routerRtpCapabilities: rtpCapabilities });
  return device;
};

export const createSendTransport = async (
  device: Device,
  audioTrack: MediaStreamTrack,
  setAudioProducer: React.Dispatch<React.SetStateAction<Producer | null>>,
  addConsumer: (consumer: Consumer) => void
): Promise<Transport> =>
  new Promise((resolve, reject) => {
    socket.emit(
      'createWebRtcTransport',
      { consumer: false },
      async ({ params }: { params: TransportOptions & { error?: string } }) => {
        if (params.error) {
          reject(params.error);
          return;
        }

        const producerTransport = device.createSendTransport(params);

        producerTransport.on('connect', ({ dtlsParameters }, callback) => {
          socket.emit('transport-connect', { dtlsParameters });
          callback();
        });

        producerTransport.on('produce', (parameters, callback) => {
          socket.emit(
            'transport-produce',
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
            },
            ({ id }: { id: string }) => {
              callback({ id });
              getProducers(socket, device, addConsumer);
            }
          );
        });

        const audioProducer = await producerTransport.produce({
          track: audioTrack,
        });

        setAudioProducer(audioProducer);

        resolve(producerTransport);

        audioProducer.on('trackended', () => {
          setAudioProducer(null);
        });
      }
    );
  });

export const getProducers = (
  socket: Socket,
  device: Device,
  addConsumer: (consumer: Consumer) => void
) => {
  socket.emit('getProducers', (producerIds: string[]) => {
    producerIds.forEach((remoteProducerId) =>
      signalNewConsumerTransport(remoteProducerId, device, addConsumer)
    );
  });
};

export const signalNewConsumerTransport = async (
  remoteProducerId: string,
  device: Device | null,
  addConsumer: (consumer: Consumer) => void
) => {
  socket.emit(
    'createWebRtcTransport',
    { consumer: true },
    async ({ params }: { params: TransportOptions & { error?: string } }) => {
      if (params.error) return;

      const consumerTransport = device!.createRecvTransport(params);
      consumerTransport.on('connect', ({ dtlsParameters }, callback) => {
        socket.emit('transport-recv-connect', {
          dtlsParameters,
          serverConsumerTransportId: params.id,
        });
        callback();
      });

      connectRecvTransport(
        consumerTransport,
        remoteProducerId,
        params.id,
        device!,
        addConsumer
      );
    }
  );
};

const connectRecvTransport = async (
  consumerTransport: Transport,
  remoteProducerId: string,
  serverConsumerTransportId: string,
  device: Device,
  addConsumer: (consumer: Consumer) => void
) => {
  socket.emit(
    'consume',
    {
      rtpCapabilities: device.rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId,
    },
    async ({
      params,
    }: {
      params: ConsumerOptions & { serverConsumerId: string; userName?: string };
    }) => {
      const consumer = await consumerTransport.consume(params);
      addConsumer(consumer);
      socket.emit('consumer-resume', {
        serverConsumerId: params.serverConsumerId,
      });
    }
  );
};
