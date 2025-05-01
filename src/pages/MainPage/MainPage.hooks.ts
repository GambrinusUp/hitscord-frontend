import { useCallback, useEffect, useRef } from 'react';

import { WebSocketHandlerProps } from './MainPage.types';

import { formatMessage, formatUser } from '~/helpers';
import { useAppSelector, useDisconnect } from '~/hooks';
import { setOpenHome } from '~/store/AppStore';
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
  setNewServerName,
  setNewUserName,
  removeUser,
  removeServer,
  editChannelName,
  addUserOnVoiceChannel,
  removeUserFromVoiceChannel,
  toggleUserMuteStatus,
} from '~/store/ServerStore';

export const useWebSocketHandler = ({
  accessToken,
  dispatch,
  serverId,
}: WebSocketHandlerProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (accessToken) {
      const ws = new WebSocket(
        `wss://hitscord-backend.online/message/ws?accessToken=${accessToken}`,
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
  }, [accessToken, serverId, dispatch]);

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

export const useApiWebSocketHandler = ({
  accessToken,
  dispatch,
  serverId,
}: WebSocketHandlerProps) => {
  const disconnect = useDisconnect();
  const wsRef = useRef<WebSocket | null>(null);
  const { currentServerId, currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );

  useEffect(() => {
    if (accessToken) {
      const ws = new WebSocket(
        `wss://hitscord-backend.online/api/ws?accessToken=${accessToken}`,
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log(data);

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

        if (data.MessageType === 'New server name') {
          if (currentServerId === data.Payload.ServerId) {
            dispatch(setNewServerName({ name: data.Payload.Name }));
          }
        }

        if (data.MessageType === 'New users name on server') {
          if (currentServerId === data.Payload.ServerId) {
            dispatch(
              setNewUserName({
                userId: data.Payload.UserId,
                name: data.Payload.Name,
              }),
            );
          }
        }

        if (data.MessageType === 'User unsubscribe') {
          if (currentServerId === data.Payload.ServerId) {
            dispatch(removeUser({ userId: data.Payload.UserId }));
          }
        }

        if (data.MessageType === 'You removed from server') {
          if (data.Payload.IsNeedRemoveFromVC) {
            disconnect(accessToken, currentVoiceChannelId!);
          }
          dispatch(setOpenHome(true));
          dispatch(removeServer({ serverId: data.Payload.ServerId }));
        }

        if (data.MessageType === 'Change channel name') {
          if (data.Payload.ServerId === currentServerId) {
            dispatch(
              editChannelName({
                channelId: data.Payload.ChannelId,
                newName: data.Payload.Name,
              }),
            );
          }
        }

        if (data.MessageType === 'New user in voice channel') {
          if (data.Payload.ServerId === currentServerId) {
            dispatch(
              addUserOnVoiceChannel({
                channelId: data.Payload.ChannelId,
                userId: data.Payload.UserId,
              }),
            );
          }
        }

        if (data.MessageType === 'User remove from voice channel') {
          if (data.Payload.ServerId === currentServerId) {
            dispatch(
              removeUserFromVoiceChannel({
                channelId: data.Payload.ChannelId,
                userId: data.Payload.UserId,
              }),
            );
          }
        }

        if (data.MessageType === 'User change his mute status') {
          if (data.Payload.ServerId === currentServerId) {
            dispatch(
              toggleUserMuteStatus({
                channelId: data.Payload.ChannelId,
                userId: data.Payload.UserId,
                isMuted: data.Payload.MuteStatus === 1,
              }),
            );
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
  }, [accessToken, serverId, dispatch]);
};
