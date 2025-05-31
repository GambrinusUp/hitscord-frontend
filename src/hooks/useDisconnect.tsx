import { socket } from '~/api/socket';
import { useMediaContext } from '~/context';

export const useDisconnect = () => {
  const {
    setIsConnected,
    setDevice,
    setVideoProducer,
    setConsumers,
    setIsMuted,
    setIsStreaming,
    setAudioProducer,
    setVideoAudioProducer,
  } = useMediaContext();

  const disconnect = async (accessToken: string, voiceChannelId: string) => {
    setIsMuted(false);

    await new Promise<void>((resolve) => {
      socket.once('leaveConfirmed', resolve);
      socket.emit('leaveRoom', { accessToken, voiceChannelId });
    });

    setIsConnected(false);
    setDevice(null);
    setConsumers([]);
    setIsStreaming(false);
    setAudioProducer(null);
    setVideoProducer(null);
    setVideoAudioProducer(null);
  };

  return disconnect;
};
