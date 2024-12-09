import {
  Consumer,
  Device,
  Producer,
  Transport,
} from 'mediasoup-client/lib/types';
import { useEffect, useState } from 'react';

import socket from '../../api/socket';
import { UserInList } from '../../utils/types';
import { signalNewConsumerTransport } from '../utils/mediaHelpers';
import { MediaContext } from './MediaContext';

export const MediaProvider = (props: React.PropsWithChildren) => {
  //проверить стрим экрана при включении и отключении микрофона, при подключении новых пользователей
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [users, setUsers] = useState<UserInList[]>([]);
  const [device, setDevice] = useState<Device | null>(null);
  const [audioProducer, setAudioProducer] = useState<Producer | null>(null);
  const [videoProducer, setVideoProducer] = useState<Producer | null>(null);
  const [producerTransport, setProducerTransport] = useState<Transport | null>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const addConsumer = (consumer: Consumer) => {
    setConsumers((prev) => [...prev, consumer]);
  };

  const toggleMute = () => {
    if (audioProducer) {
      if (isMuted) {
        audioProducer.resume();
      } else {
        audioProducer.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('producerClosed', ({ producerId }) => {
      setConsumers((prev) =>
        prev.filter((consumer) => consumer.producerId !== producerId)
      );
    });

    socket.on('producer-closed', ({ remoteProducerId }) => {
      setConsumers((prevConsumers) =>
        prevConsumers.filter(
          (consumer) => consumer.producerId !== remoteProducerId
        )
      );
    });

    socket.on('new-producer', ({ producerId }: { producerId: string }) => {
      if (device) {
        signalNewConsumerTransport(producerId, device, addConsumer);
      }
    });

    socket.on('updateUsersList', ({ usersList }) => {
      setUsers(usersList);
    });

    return () => {
      socket.off('producerClosed');
      socket.off('producer-closed');
      socket.off('new-producer');
      socket.off('updateUsersList');
    };
  }, [device]);

  return (
    <MediaContext.Provider
      value={{
        isConnected,
        isMuted,
        isStreaming,
        setIsConnected,
        setIsMuted,
        setIsStreaming,
        audioProducer,
        setAudioProducer,
        videoProducer,
        setVideoProducer,
        device,
        setDevice,
        producerTransport,
        setProducerTransport,
        consumers,
        users,
        addConsumer,
        setConsumers,
        toggleMute,
        selectedUserId,
        setSelectedUserId,
      }}
    >
      {props.children}
    </MediaContext.Provider>
  );
};
