import { useEffect } from 'react';

import { formatMessage } from '../../helpers/formatMessage';
import { formatUser } from '../../helpers/formatUser';
import { useDisconnect } from '../../hooks/useDisconnect';
import { getServerData } from '../../store/server/ServerActionCreators';
import {
  addMessage,
  addUserWs,
  deleteMessageWs,
  deleteUserWs,
  editMessageWs,
} from '../../store/server/TestServerSlice';
import { AppDispatch } from '../../store/store';

interface WebSocketHandlerProps {
  accessToken: string | null;
  dispatch: AppDispatch;
  serverId: string | null;
  currentVoiceChannelId: string | null;
}

const useWebSocketHandler = ({
  accessToken,
  dispatch,
  serverId,
  currentVoiceChannelId,
}: WebSocketHandlerProps) => {
  const disconnect = useDisconnect();

  useEffect(() => {
    if (accessToken) {
      const ws = new WebSocket(
        `wss://hitscord-backend.online/ws?accessToken=${accessToken}`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log(data);

        if (data.MessageType === 'New message') {
          const formattedMessage = formatMessage(data.Payload);
          if (formattedMessage.id && formattedMessage.text) {
            dispatch(addMessage(formattedMessage));
          }
        }

        if (data.MessageType === 'Deleted message') {
          dispatch(
            deleteMessageWs({
              channelId: data.Payload.ChannelId,
              messageId: data.Payload.MessageId,
            })
          );
        }

        if (data.MessageType === 'Updated message') {
          const formattedMessage = formatMessage(data.Payload);
          dispatch(editMessageWs(formattedMessage));
        }

        if (data.MessageType === 'New user on server') {
          const formattedUser = formatUser(data.Payload);
          dispatch(addUserWs(formattedUser));
        }

        if (data.MessageType === 'User unsubscribe') {
          const { UserId, ServerId } = data.Payload;
          dispatch(deleteUserWs({ UserId, ServerId }));
        }

        if (data.MessageType === 'Role changed') {
          if (accessToken && serverId) {
            dispatch(getServerData({ accessToken, serverId }));
          }
        }

        if (
          data.MessageType === 'New channel' ||
          data.MessageType === 'Channel deleted'
        ) {
          if (accessToken && serverId) {
            if (
              data.Payload.ChannelType === 1 &&
              data.Payload.ChannelId === currentVoiceChannelId
            ) {
              disconnect();
            }
            dispatch(getServerData({ accessToken, serverId }));
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        console.log('Closing WebSocket connection');
        ws.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentVoiceChannelId, dispatch]);
};

export default useWebSocketHandler;
