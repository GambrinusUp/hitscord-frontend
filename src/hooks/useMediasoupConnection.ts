/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Device } from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseMediasoupConnection {
  connect: () => void;
  disconnect: () => void;
  startScreenSharing: () => Promise<void>;
  stopScreenSharing: () => Promise<void>;
  consumers: any[];
  connected: boolean;
  users: any[];
}

export const useMediasoupConnection = (
  roomName: string
): UseMediasoupConnection => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [consumers, setConsumers] = useState<any[]>([]);
  const [producerTransports, setProducerTransports] = useState<any>(null);
  const videoProducerRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io('https://192.168.0.100:3000/mediasoup');
    setSocket(newSocket);

    newSocket.on('connection-success', ({ socketId }: { socketId: string }) => {
      console.log('Connected with socketId', socketId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const connect = () => {
    //const newSocket = io('https://192.168.0.115:3000/mediasoup');
    //setSocket(newSocket);
    setConnected(true);
    getLocalAudioStream();
  };

  const disconnect = () => {
    //socket?.disconnect();
    socket?.emit('leaveRoom');
    setConnected(false);
    //setSocket(null);
    setDevice(null);
    setConsumers([]);
    videoProducerRef.current = null;
  };

  useEffect(() => {
    if (device) {
      getProducers();
    }
  }, [device]);

  useEffect(() => {
    if (!socket) return;

    /*socket.on('connection-success', ({ socketId }: { socketId: string }) => {
      console.log('Connected with socketId', socketId);
      getLocalAudioStream();
    });*/

    socket.on('producerClosed', ({ producerId }) => {
      setConsumers((prev) =>
        prev.filter((consumer) => consumer.producerId !== producerId)
      );
    });

    socket.on('producer-closed', ({ remoteProducerId }) => {
      console.log('producer-closed: ', remoteProducerId);
      setConsumers((prevConsumers) =>
        prevConsumers.filter(
          (consumer) => consumer.producerId !== remoteProducerId
        )
      );
    });

    socket.on('new-producer', ({ producerId }: { producerId: string }) => {
      console.log('newProducer:', producerId);
      if (device) signalNewConsumerTransport(producerId);
    });

    socket.on('updateUsersList', ({ usersList }) => {
      //console.log('users: ', usersList);
      setUsers(usersList);
    });

    return () => {
      //socket.off('connection-success');
      socket.off('producerClosed');
      //
      socket.off('producer-closed');
      socket.off('new-producer');
      socket.off('updateUsersList');
    };
  }, [socket, device]);

  const getLocalAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      joinRoom(stream.getAudioTracks()[0]);
    } catch (error) {
      console.error('Error getting local audio stream:', error);
    }
  };

  const joinRoom = (audioTrack: MediaStreamTrack) => {
    socket?.emit('joinRoom', { roomName }, (data: any) => {
      createDevice(audioTrack, data.rtpCapabilities);
    });
  };

  const createDevice = async (
    audioTrack: MediaStreamTrack,
    rtpCapabilities: RtpCapabilities
  ) => {
    const newDevice = new Device();
    await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
    setDevice(newDevice);
    createSendTransport(audioTrack, newDevice);
  };

  const createSendTransport = (
    audioTrack: MediaStreamTrack,
    device: Device
  ) => {
    socket?.emit(
      'createWebRtcTransport',
      { consumer: false },
      async ({ params }: any) => {
        if (params.error) {
          console.error('Error creating send transport:', params.error);
          return;
        }

        const producerTransport = device.createSendTransport(params);
        setProducerTransports(producerTransport);

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
              getProducers();
            }
          );
        });

        await producerTransport.produce({ track: audioTrack });
      }
    );
  };

  const getProducers = () => {
    socket?.emit('getProducers', (producerIds: string[]) => {
      producerIds.forEach(signalNewConsumerTransport);
    });
  };

  const signalNewConsumerTransport = async (remoteProducerId: string) => {
    socket?.emit(
      'createWebRtcTransport',
      { consumer: true },
      async ({ params }: any) => {
        if (params.error) return;

        const consumerTransport = device?.createRecvTransport(params);
        consumerTransport?.on('connect', ({ dtlsParameters }, callback) => {
          socket.emit('transport-recv-connect', {
            dtlsParameters,
            serverConsumerTransportId: params.id,
          });
          callback();
        });

        connectRecvTransport(consumerTransport, remoteProducerId, params.id);
      }
    );
  };

  const connectRecvTransport = async (
    consumerTransport: any,
    remoteProducerId: string,
    serverConsumerTransportId: string
  ) => {
    socket?.emit(
      'consume',
      {
        rtpCapabilities: device?.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }: any) => {
        const consumer = await consumerTransport.consume(params);
        setConsumers((prev) => [...prev, consumer]);
        socket.emit('consumer-resume', {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  const startScreenSharing = async () => {
    if (!videoProducerRef.current) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];
      videoProducerRef.current = await producerTransports.produce({
        track: screenTrack,
      });
      videoProducerRef.current.on('trackended', stopScreenSharing);
    }
  };

  const stopScreenSharing = async () => {
    if (videoProducerRef.current) {
      await videoProducerRef.current.close();
      socket?.emit('stopProducer', { producerId: videoProducerRef.current.id });
      videoProducerRef.current = null;
    }
  };

  return {
    connect,
    disconnect,
    startScreenSharing,
    stopScreenSharing,
    consumers,
    connected,
    users,
  };
};
