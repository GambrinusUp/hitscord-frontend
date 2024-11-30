/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Device } from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { ActiveUser } from '../utils/types';

interface UseMediasoupConnection {
  connect: () => void;
  disconnect: () => void;
  startScreenSharing: () => Promise<void>;
  stopScreenSharing: () => Promise<void>;
  consumers: any[];
  connected: boolean;
  users: any[];
  toggleMute: () => void;
  isMuted: boolean;
  isStreaming: boolean;
  activeUsers: { producerId: string; volume: number }[];
}

//баги: закрытие окна стрима, при перерендере (изменить и сохранить изменения в коде и потом открыть страничку) пропадают users

export const useMediasoupConnection = (
  roomName: string,
  userName: string
): UseMediasoupConnection => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [consumers, setConsumers] = useState<any[]>([]);
  const [producerTransports, setProducerTransports] = useState<any>(null);
  const videoProducerRef = useRef<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioProducerRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  const toggleMute = () => {
    if (audioProducerRef.current) {
      if (isMuted) {
        audioProducerRef.current.resume();
      } else {
        audioProducerRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    //const newSocket = io('https://hitscord-backend.ru/mediasoup');
    //const newSocket = io('https://51.250.111.226:3000/mediasoup');
    const newSocket = io('https://192.168.0.101:3000/mediasoup');
    setSocket(newSocket);

    newSocket.on('connection-success', ({ socketId }: { socketId: string }) => {
      console.log('Connected with socketId', socketId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const connect = () => {
    if (socket?.connected) {
      setConnected(true);
      getLocalAudioStream();
      console.log(socket.id);
    }
  };

  const disconnect = () => {
    socket?.emit('leaveRoom');
    setConnected(false);
    setDevice(null);
    setConsumers([]);
    setIsMuted(false);
    setIsStreaming(false);
    videoProducerRef.current = null;
  };

  useEffect(() => {
    if (device) {
      getProducers();
    }
  }, [device]);

  useEffect(() => {
    if (!socket) return; //?? возможно нарушает порядок хуков

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
      setUsers(usersList);
    });

    socket.on('active-speakers', ({ activeSpeakers }) => {
      //console.log('Active speakers:', activeSpeakers);
      setActiveUsers(activeSpeakers);
      // Обновите UI, чтобы показать, кто говорит
    });

    return () => {
      socket.off('producerClosed');
      socket.off('producer-closed');
      socket.off('new-producer');
      socket.off('updateUsersList');
      socket.off('audio-level-updated');
    };
  }, [socket, device]);

  const getLocalAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: false,
          autoGainControl: false,
        },
      });
      joinRoom(stream.getAudioTracks()[0]);
    } catch (error) {
      console.error('Error getting local audio stream:', error);
    }
  };

  const joinRoom = (audioTrack: MediaStreamTrack) => {
    socket?.emit('joinRoom', { roomName, userName }, (data: any) => {
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
              console.log(id);
              callback({ id });
              getProducers();
            }
          );
        });

        // Создание и сохранение audioProducer
        const audioProducer = await producerTransport.produce({
          track: audioTrack,
        });
        audioProducerRef.current = audioProducer;

        // Обработка окончания трека
        audioProducer.on('trackended', () => {
          console.log('Audio track ended');
          audioProducerRef.current = null;
        });
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
        console.log(consumer);
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
      setIsStreaming(true);
    }
  };

  const stopScreenSharing = async () => {
    if (videoProducerRef.current) {
      await videoProducerRef.current.close();
      socket?.emit('stopProducer', { producerId: videoProducerRef.current.id });
      videoProducerRef.current = null;
      setIsStreaming(false);
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
    toggleMute,
    isMuted,
    isStreaming,
    activeUsers,
  };
};
