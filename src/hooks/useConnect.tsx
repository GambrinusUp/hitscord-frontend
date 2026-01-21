import { useSound } from 'use-sound';

import { socket } from '~/api/socket';
import {
  useMediaContext,
  createDevice,
  createSendTransport,
  getLocalAudioStream,
  joinRoom,
} from '~/context';
import sound from '~/shared/static/zapsplat_multimedia_alert_prompt_mallet_marimba_success_104792.mp3';

export const useConnect = () => {
  const {
    setIsConnected,
    setAudioProducer,
    setDevice,
    setProducerTransport,
    addConsumer,
  } = useMediaContext();
  const [play] = useSound(sound, { volume: 0.35 });

  const connect = async (
    roomName: string,
    userName: string,
    userId: string,
    serverId: string,
    accessToken: string,
  ) => {
    try {
      if (!socket.connected) {
        throw new Error('Socket is not connected');
      }

      const audioTrack = await getLocalAudioStream();

      const roomData = await joinRoom(
        roomName,
        userName,
        userId,
        serverId,
        accessToken,
      );

      const device = await createDevice(roomData);
      setDevice(device);

      const producerTransport = await createSendTransport(
        device,
        audioTrack,
        setAudioProducer,
        addConsumer,
      );

      setProducerTransport(producerTransport);

      setIsConnected(true);
      play();
    } catch (error) {
      console.error('Error connecting:', error);
      setIsConnected(false);
    }
  };

  return connect;
};
