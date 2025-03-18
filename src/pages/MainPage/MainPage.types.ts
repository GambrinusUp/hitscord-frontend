import { AppDispatch } from '~/store/store';

export interface WebSocketHandlerProps {
  accessToken: string | null;
  dispatch: AppDispatch;
  serverId: string | null;
  currentVoiceChannelId: string | null;
}
