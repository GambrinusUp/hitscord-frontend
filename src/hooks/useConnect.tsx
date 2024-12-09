import socket from '../api/socket';
import { useMediaContext } from '../context/MediaContext/useMediaContext';
import {
  createDevice,
  createSendTransport,
  getLocalAudioStream,
  joinRoom,
} from '../context/utils/mediaHelpers';

export const useConnect = () => {
  const {
    setIsConnected,
    setAudioProducer,
    setDevice,
    setProducerTransport,
    addConsumer,
  } = useMediaContext();

  const connect = async (roomName: string, userName: string) => {
    try {
      if (!socket.connected) {
        throw new Error('Socket is not connected');
      }

      const audioTrack = await getLocalAudioStream();

      const roomData = await joinRoom(roomName, userName);

      const device = await createDevice(roomData);
      setDevice(device);

      const producerTransport = await createSendTransport(
        device,
        audioTrack,
        setAudioProducer,
        addConsumer
      );
      setProducerTransport(producerTransport);

      setIsConnected(true);
      console.log('Connected successfully');
    } catch (error) {
      console.error('Error connecting:', error);
      setIsConnected(false);
    }
  };

  return connect;
};
