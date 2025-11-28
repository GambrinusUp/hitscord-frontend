import { useCallback } from 'react';

import { MessageType } from '~/entities/message/model/types';
import { useAppSelector } from '~/hooks';

export const useMessageAuthor = (type: MessageType) => {
  const usersOnServer = useAppSelector(
    (state) => state.testServerStore.serverData.users,
  );
  const usersOnChat = useAppSelector((state) => state.chatsStore.chat.users);

  const getUsername = useCallback(
    (authorId: string) => {
      switch (type) {
        case MessageType.CHAT: {
          const userName = usersOnChat.find(
            (user) => user.userId === authorId,
          )?.userName;

          return userName;
        }
        case MessageType.CHANNEL: {
          const userName = usersOnServer.find(
            (user) => user.userId === authorId,
          )?.userName;

          return userName;
        }
        case MessageType.SUBCHAT: {
          const userName = usersOnServer.find(
            (user) => user.userId === authorId,
          )?.userName;

          return userName;
        }
        default:
          return '';
      }
    },
    [type, usersOnServer, usersOnChat],
  );

  const getUserIcon = useCallback(
    (authorId: string) => {
      switch (type) {
        case MessageType.CHAT: {
          const userIcon = usersOnChat.find(
            (user) => user.userId === authorId,
          )?.icon;

          return userIcon?.fileId;
        }
        case MessageType.CHANNEL: {
          const userIcon = usersOnServer.find(
            (user) => user.userId === authorId,
          )?.icon;

          return userIcon?.fileId;
        }
        default:
          return '';
      }
    },
    [type, usersOnServer, usersOnChat],
  );

  return { getUsername, getUserIcon };
};
