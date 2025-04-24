import { useCallback, useEffect, useRef } from 'react';

import { WebSocketHandlerProps } from './MainPage.types';

import { formatMessage, formatUser } from '~/helpers';
import { useDisconnect } from '~/hooks';
import {
  getServerData,
  addMessage,
  addUserWs,
  deleteMessageWs,
  deleteUserWs,
  editMessageWs,
  CreateMessageWs,
  DeleteMessageWs,
  EditMessageWs,
} from '~/store/ServerStore';

export const useWebSocketHandler = ({
  accessToken,
  dispatch,
  serverId,
  currentVoiceChannelId,
}: WebSocketHandlerProps) => {
  const disconnect = useDisconnect();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (accessToken) {
      const ws = new WebSocket(
        `wss://hitscord-backend.online/sockets/ws?accessToken=${accessToken}`,
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
            }),
          );
        }

        if (data.MessageType === 'Updated message') {
          const formattedMessage = formatMessage(data.Payload);
          dispatch(editMessageWs(formattedMessage));
        }

        if (data.MessageType === 'New user on server') {
          const formattedUser = formatUser(data.Payload);
          const { ServerId } = data.Payload;

          if (serverId === ServerId) {
            dispatch(addUserWs(formattedUser));
          }
        }

        if (data.MessageType === 'User unsubscribe') {
          const { UserId, ServerId } = data.Payload;

          if (serverId === ServerId) {
            dispatch(deleteUserWs({ UserId, ServerId }));
          }
        }

        if (data.MessageType === 'Role changed') {
          const { ServerId } = data.Payload;

          if (accessToken && serverId && serverId === ServerId) {
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
              disconnect(accessToken, currentVoiceChannelId!);
            }

            if (serverId === data.Payload.ServerId) {
              dispatch(getServerData({ accessToken, serverId }));
            }
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;

      return () => {
        console.log('Closing WebSocket connection');
        ws.close();
      };
    }
  }, [accessToken, serverId, currentVoiceChannelId, dispatch]);

  const sendMessage = useCallback((message: CreateMessageWs) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const sendData = {
        Type: 'New message',
        Content: message,
      };

      wsRef.current.send(JSON.stringify(sendData));
    } else {
      console.error(
        'WebSocket is not open. Ready state:',
        wsRef.current?.readyState,
      );
    }
  }, []);

  const editMessage = useCallback((message: EditMessageWs) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const sendData = {
        Type: 'Update message',
        Content: message,
      };

      wsRef.current.send(JSON.stringify(sendData));
    } else {
      console.error(
        'WebSocket is not open. Ready state:',
        wsRef.current?.readyState,
      );
    }
  }, []);

  const deleteMessage = useCallback((message: DeleteMessageWs) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const sendData = {
        Type: 'Delete message',
        Content: message,
      };

      wsRef.current.send(JSON.stringify(sendData));
    } else {
      console.error(
        'WebSocket is not open. Ready state:',
        wsRef.current?.readyState,
      );
    }
  }, []);

  return { sendMessage, editMessage, deleteMessage };
};
