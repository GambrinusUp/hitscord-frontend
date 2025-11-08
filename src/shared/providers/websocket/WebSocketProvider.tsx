import { useCallback, useEffect, useRef } from 'react';

import { WebSocketContext } from './WebSocketContext';

import {
  addChat,
  addChatMessage,
  addUserInChatWs,
  changeChatReadedCount,
  deleteChatMessageWS,
  editChatMessageWS,
  readOwnChatMessage,
  updateChatIcon,
} from '~/entities/chat';
import { Vote } from '~/entities/vote';
import { formatMessage, formatNotification, formatUser } from '~/helpers';
import { formatChatMessage, formatMessageFile } from '~/helpers/formatMessage';
import {
  useAppDispatch,
  useNotification,
  useAppSelector,
  useDisconnect,
} from '~/hooks';
import { setOpenHome } from '~/store/AppStore';
import {
  addMessage,
  deleteMessageWs,
  editMessageWs,
  CreateMessageWs,
  EditMessageWs,
  DeleteMessageWs,
  ReadMessageWs,
  changeReadedCount,
  readOwnMessage,
  addUserOnVoiceChannel,
  addUserWs,
  deleteUserWs,
  editChannelName,
  getServerData,
  removeServer,
  removeUser,
  removeUserFromVoiceChannel,
  setNewServerName,
  setNewUserName,
  toggleUserMuteStatus,
  addRoleToUserWs,
  removeRoleFromUserWs,
  updateVoteWs,
} from '~/store/ServerStore';

export const WebSocketProvider = (props: React.PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const disconnect = useDisconnect();
  const { showMessage, showError } = useNotification();
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const { currentServerId, currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const wsRef = useRef<WebSocket | null>(null);

  const serverIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);
  const currentVoiceChannelIdRef = useRef(currentVoiceChannelId);
  const notificationLifeTimeRef = useRef(0);

  useEffect(() => {
    serverIdRef.current = currentServerId;
  }, [currentServerId]);

  useEffect(() => {
    userIdRef.current = user.id;
  }, [user]);

  useEffect(() => {
    currentVoiceChannelIdRef.current = currentVoiceChannelId;
  }, [currentVoiceChannelId]);

  useEffect(() => {
    notificationLifeTimeRef.current = user.notificationLifeTime;
  }, [user.notificationLifeTime]);

  useEffect(() => {
    if (accessToken) {
      const ws = new WebSocket(
        `wss://hitscord-backend.online/api/wss?accessToken=${accessToken}`,
      );

      ws.onopen = () => {
        setInterval(
          () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          },
          5 * 60 * 1000,
        );
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const currentServerIdValue = serverIdRef.current;
        const currentUserIdValue = userIdRef.current;
        const currentVoiceChannelIdValue = currentVoiceChannelIdRef.current;
        const notificationLifeTimeValue = notificationLifeTimeRef.current;

        console.log(data);

        if (data.MessageType === 'New user on server') {
          const formattedUser = formatUser(data.Payload);
          const { ServerId } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(addUserWs(formattedUser));
          }
        }

        if (data.MessageType === 'User unsubscribe') {
          const { UserId, ServerId } = data.Payload;

          if (currentServerIdValue === ServerId) {
            dispatch(deleteUserWs({ UserId, ServerId }));
          }
        }

        if (data.MessageType === 'Role changed') {
          const { ServerId } = data.Payload;

          if (
            accessToken &&
            currentServerIdValue &&
            currentServerIdValue === ServerId
          ) {
            dispatch(
              getServerData({ accessToken, serverId: currentServerIdValue }),
            );
          }
        }

        if (
          data.MessageType === 'New channel' ||
          data.MessageType === 'Channel deleted'
        ) {
          if (accessToken && currentServerIdValue) {
            if (
              data.Payload.ChannelType === 1 &&
              data.Payload.ChannelId === currentVoiceChannelIdValue
            ) {
              disconnect(accessToken, currentVoiceChannelIdValue!);
            }

            if (currentServerIdValue === data.Payload.ServerId) {
              dispatch(
                getServerData({ accessToken, serverId: currentServerIdValue }),
              );
            }
          }
        }

        if (data.MessageType === 'New server name') {
          if (currentServerIdValue === data.Payload.ServerId) {
            dispatch(setNewServerName({ name: data.Payload.Name }));
          }
        }

        if (data.MessageType === 'New users name on server') {
          if (currentServerIdValue === data.Payload.ServerId) {
            dispatch(
              setNewUserName({
                userId: data.Payload.UserId,
                name: data.Payload.Name,
              }),
            );
          }
        }

        if (data.MessageType === 'User unsubscribe') {
          if (currentServerIdValue === data.Payload.ServerId) {
            dispatch(removeUser({ userId: data.Payload.UserId }));
          }
        }

        if (data.MessageType === 'You removed from server') {
          if (data.Payload.IsNeedRemoveFromVC) {
            disconnect(accessToken, currentVoiceChannelIdValue!);
          }
          dispatch(setOpenHome(true));
          dispatch(removeServer({ serverId: data.Payload.ServerId }));
        }

        if (data.MessageType === 'Change channel name') {
          if (data.Payload.ServerId === currentServerIdValue) {
            dispatch(
              editChannelName({
                channelId: data.Payload.ChannelId,
                newName: data.Payload.Name,
              }),
            );
          }
        }

        if (data.MessageType === 'New user in voice channel') {
          if (data.Payload.ServerId === currentServerIdValue) {
            dispatch(
              addUserOnVoiceChannel({
                channelId: data.Payload.ChannelId,
                userId: data.Payload.UserId,
              }),
            );
          }
        }

        if (data.MessageType === 'User remove from voice channel') {
          if (data.Payload.ServerId === currentServerIdValue) {
            dispatch(
              removeUserFromVoiceChannel({
                channelId: data.Payload.ChannelId,
                userId: data.Payload.UserId,
              }),
            );
          }
        }

        if (data.MessageType === 'User change his mute status') {
          if (data.Payload.ServerId === currentServerIdValue) {
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

          if (currentUserIdValue === RoleId) {
            if (currentServerIdValue && currentServerIdValue === ServerId) {
              dispatch(
                getServerData({ accessToken, serverId: currentServerIdValue }),
              );
            }
          }
        }

        if (data.MessageType === 'Voice channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          if (currentUserIdValue === RoleId) {
            if (currentServerIdValue && currentServerIdValue === ServerId) {
              dispatch(
                getServerData({ accessToken, serverId: currentServerIdValue }),
              );
            }
          }
        }

        if (data.MessageType === 'New role') {
          const { ServerId } = data.Payload;

          if (currentServerIdValue && currentServerIdValue === ServerId) {
            dispatch(
              getServerData({ accessToken, serverId: currentServerIdValue }),
            );
          }
        }

        if (data.MessageType === 'Updated role settings') {
          const { ServerId, Id } = data.Payload.Role;

          if (currentUserIdValue === Id) {
            if (currentServerIdValue && currentServerIdValue === ServerId) {
              dispatch(
                getServerData({ accessToken, serverId: currentServerIdValue }),
              );
            }
          }
        }

        if (data.MessageType === 'Voice channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          if (currentUserIdValue === RoleId) {
            if (currentServerIdValue && currentServerIdValue === ServerId) {
              dispatch(
                getServerData({ accessToken, serverId: currentServerIdValue }),
              );
            }
          }
        }

        if (data.MessageType === 'Text channel settings edited') {
          const { ServerId, RoleId } = data.Payload;

          if (currentUserIdValue === RoleId) {
            if (currentServerIdValue && currentServerIdValue === ServerId) {
              dispatch(
                getServerData({ accessToken, serverId: currentServerIdValue }),
              );
            }
          }
        }

        if (data.MessageType === 'New message') {
          const formattedMessage = formatMessage(data.Payload);

          if (formattedMessage.id) {
            dispatch(addMessage(formattedMessage));

            if (formattedMessage.authorId !== user.id) {
              dispatch(
                changeReadedCount({
                  channelId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                  serverId: formattedMessage.serverId!,
                }),
              );
            } else {
              dispatch(
                readOwnMessage({
                  channelId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                  serverId: formattedMessage.serverId!,
                }),
              );
            }
          }
        }

        if (data.MessageType === 'New message in chat') {
          const formattedMessage = formatChatMessage(data.Payload);

          if (formattedMessage.id && formattedMessage.text) {
            dispatch(addChatMessage(formattedMessage));

            if (formattedMessage.authorId !== user.id) {
              dispatch(
                changeChatReadedCount({
                  readChatId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                }),
              );
            } else {
              dispatch(
                readOwnChatMessage({
                  readChatId: formattedMessage.channelId,
                  readedMessageId: formattedMessage.id,
                }),
              );
            }
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
            showMessage(
              formatNotification(data.Payload),
              notificationLifeTimeValue,
            );
          }
        }

        if (data.MessageType === 'ErrorWithMessage') {
          const message = `${data.Payload.Object}: ${data.Payload.Message}`;
          showError(message);
        }

        if (data.MessageType === 'Role added to user') {
          dispatch(
            addRoleToUserWs({
              channelId: data.Payload.ServerId,
              userId: data.Payload.UserId,
              roleId: data.Payload.RoleId,
            }),
          );
        }

        if (data.MessageType === 'Role removed from user') {
          dispatch(
            removeRoleFromUserWs({
              channelId: data.Payload.ServerId,
              userId: data.Payload.UserId,
              roleId: data.Payload.RoleId,
            }),
          );
        }

        if (data.MessageType === 'New user in chat') {
          dispatch(
            addUserInChatWs({
              chatId: data.Payload.ChatId,
              userId: data.Payload.UserId,
              userName: data.Payload.UserName,
              userTag: data.Payload.UserTag,
              icon: data.Payload.Icon
                ? formatMessageFile(data.Payload.Icon)
                : null,
              notifiable: data.Payload.Notifiable,
              friendshipApplication: data.Payload.FriendshipApplication,
              nonFriendMessage: data.Payload.NonFriendMessage,
              isFriend: data.Payload.isFriend,
            }),
          );
        }

        if (data.MessageType === 'You added to chat') {
          dispatch(
            addChat({
              chatId: data.Payload.ChatId,
              chatName: data.Payload.ChatName,
              nonReadedCount: data.Payload.NonReadedCount,
              nonReadedTaggedCount: data.Payload.NonReadedTaggedCount,
              lastReadedMessageId: data.Payload.LastReadedMessageId,
              icon: data.Payload.Icon
                ? formatMessageFile(data.Payload.Icon)
                : null,
            }),
          );
        }

        if (data.MessageType === 'New icon on chat') {
          dispatch(
            updateChatIcon({
              chatId: data.Payload.ChatId,
              icon: formatMessageFile(data.Payload.Icon),
            }),
          );
        }

        if (
          data.MessageType === 'User voted' ||
          data.MessageType === 'User unvoted'
        ) {
          const formattedMessage = formatMessage(data.Payload);

          dispatch(updateVoteWs(formattedMessage));
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
  }, [accessToken, dispatch]);

  const sendMessage = useCallback(
    (message: CreateMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'New message',
          Content: message,
        };

        console.log(sendData);
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

  const sendChatMessage = useCallback(
    (message: CreateMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'New message chat',
          Content: message,
        };

        console.log(sendData);

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

  const editMessage = useCallback(
    (message: EditMessageWs) => {
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
    },
    [wsRef],
  );

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

  const deleteMessage = useCallback(
    (message: DeleteMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Delete message',
          Content: message,
        };

        console.log(sendData);

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

  const readMessage = useCallback(
    (message: ReadMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'See message',
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

  const vote = useCallback(
    (voteData: Vote) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Vote',
          Content: voteData,
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

  const unVote = useCallback(
    (voteData: Vote) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Unvote',
          Content: voteData,
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

  return (
    <WebSocketContext.Provider
      value={{
        sendMessage,
        sendChatMessage,
        editMessage,
        editChatMessage,
        deleteMessage,
        deleteChatMessage,
        readMessage,
        vote,
        unVote,
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
