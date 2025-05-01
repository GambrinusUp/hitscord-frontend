import { useAppDispatch } from './redux';

import { socket } from '~/api/socket';
import { useMediaContext } from '~/context';
import { selfMute } from '~/store/ServerStore';

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
  const dispatch = useAppDispatch();

  const disconnect = (accessToken: string, voiceChannelId: string) => {
    setIsMuted(false);
    dispatch(selfMute({ accessToken }));
    socket.emit('leaveRoom', { accessToken, voiceChannelId });
    setIsConnected(false);
    setDevice(null);
    setConsumers([]);
    setIsStreaming(false);
    setAudioProducer(null);
    setVideoProducer(null);
  };

  return disconnect;
};
