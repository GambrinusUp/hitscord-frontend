import { useCallback, useEffect, useRef } from 'react';

import { WebSocketHandlerProps } from './MainPage.types';

import { formatMessage, formatUser } from '~/helpers';
import { formatChatMessage } from '~/helpers/formatMessage';
import { useAppSelector, useDisconnect, useNotification } from '~/hooks';
import { setOpenHome } from '~/store/AppStore';
import {
  addChatMessage,
  deleteChatMessageWS,
  editChatMessageWS,
} from '~/store/ChatsStore';
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
  showMessage,
}: WebSocketHandlerProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { showError } = useNotification();

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

        if (data.MessageType === 'New message in chat') {
          const formattedMessage = formatChatMessage(data.Payload);

          if (formattedMessage.id && formattedMessage.text) {
            dispatch(addChatMessage(formattedMessage));
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

        if (data.MessageType === 'Deleted message in chat') {
          dispatch(
            deleteChatMessageWS({
              chatId: data.Payload.ChatId,
              messageId: data.Payload.MessageId,
            }),
          );
        }

        if (data.MessageType === 'Updated message') {
          const formattedMessage = formatMessage(data.Payload);
          dispatch(editMessageWs(formattedMessage));
        }

        if (data.MessageType === 'Updated message in chat') {
          const formattedMessage = formatChatMessage(data.Payload);
          dispatch(editChatMessageWS(formattedMessage));
        }

        if (data.MessageType === 'User notified') {
          if (showMessage) {
            showMessage(data.Payload.Text);
          }
        }

        if (data.MessageType === 'ErrorWithMessage') {
          const message = `${data.Payload.Object}: ${data.Payload.Message}`;
          showError(message);
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

  const sendChatMessage = useCallback(
    (message: CreateMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'New message chat',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

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

  const editChatMessage = useCallback(
    (message: EditMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Update message chat',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

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

  const deleteChatMessage = useCallback(
    (message: DeleteMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Delete message chat',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  return {
    sendMessage,
    editMessage,
    deleteMessage,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
  };
};

export const useApiWebSocketHandler = ({
  accessToken,
  dispatch,
  serverId,
  userId,
}: WebSocketHandlerProps) => {
  const disconnect = useDisconnect();
  const wsRef = useRef<WebSocket | null>(null);
  const { currentServerId, currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );

  useEffect(() => {
    if (accessToken && userId) {
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

        if (data.MessageType === 'Text channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          if (userId === RoleId) {
            if (serverId && serverId === ServerId) {
              dispatch(getServerData({ accessToken, serverId }));
            }
          }
        }

        if (data.MessageType === 'Voice channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          if (userId === RoleId) {
            if (serverId && serverId === ServerId) {
              dispatch(getServerData({ accessToken, serverId }));
            }
          }
        }

        if (data.MessageType === 'New role') {
          const { ServerId } = data.Payload;

          if (serverId && serverId === ServerId) {
            dispatch(getServerData({ accessToken, serverId }));
          }
        }

        if (data.MessageType === 'Updated role settings') {
          const { ServerId, Id } = data.Payload.Role;

          console.log(`Id:${Id}, serverData: ${userId}`);

          if (userId === Id) {
            if (serverId && serverId === ServerId) {
              dispatch(getServerData({ accessToken, serverId }));
            }
          }
        }

        if (data.MessageType === 'Voice channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          if (userId === RoleId) {
            if (serverId && serverId === ServerId) {
              dispatch(getServerData({ accessToken, serverId }));
            }
          }
        }

        if (data.MessageType === 'Text channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          if (userId === RoleId) {
            if (serverId && serverId === ServerId) {
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
  }, [accessToken, serverId, userId, dispatch]);
};
