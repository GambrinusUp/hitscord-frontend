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
  } = useMediaContext();

  const disconnect = () => {
    socket.emit('leaveRoom');
    setIsConnected(false);
    setDevice(null);
    setConsumers([]);
    setIsMuted(false);
    setIsStreaming(false);
    setAudioProducer(null);
    setVideoProducer(null);
  };

  return disconnect;
};
