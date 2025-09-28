import { useEffect, useRef } from 'react';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { getChatMessages, getMoreChatMessages } from '~/entities/chat';
import { MessageType } from '~/entities/message';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { getMoreMessages } from '~/store/ServerStore';

export const useMessages = (
  scrollRef: React.RefObject<HTMLDivElement>,
  type: MessageType,
) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);

  const chatsStore = useAppSelector((state) => state.chatsStore);
  const channelsStore = useAppSelector((state) => state.testServerStore);

  const {
    messages,
    messagesStatus,
    remainingMessagesCount,
    numberOfStarterMessage,
    entityId,
  } =
    type === MessageType.CHAT
      ? {
          messages: chatsStore.messages,
          messagesStatus: chatsStore.messagesStatus,
          remainingMessagesCount: chatsStore.remainingMessagesCount,
          numberOfStarterMessage: chatsStore.numberOfStarterMessage,
          entityId: chatsStore.chat?.chatId,
        }
      : {
          messages: channelsStore.messages,
          messagesStatus: channelsStore.messagesStatus,
          remainingMessagesCount: channelsStore.remainingMessagesCount,
          numberOfStarterMessage: channelsStore.numberOfStarterMessage,
          entityId: channelsStore.currentChannelId,
        };

  const firstMessageElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!entityId) return;

    if (type === MessageType.CHAT) {
      dispatch(
        getChatMessages({
          chatId: entityId,
          number: MAX_MESSAGE_NUMBER,
          fromStart: numberOfStarterMessage,
        }),
      );
    }
  }, [type, entityId, numberOfStarterMessage]);

  useEffect(() => {
    if (!firstMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || remainingMessagesCount <= 0) return;

        if (type === MessageType.CHAT && entityId) {
          dispatch(
            getMoreChatMessages({
              chatId: entityId,
              number: Math.min(remainingMessagesCount, MAX_MESSAGE_NUMBER),
              fromStart: numberOfStarterMessage,
            }),
          );
        }

        if (type === MessageType.CHANNEL && entityId) {
          dispatch(
            getMoreMessages({
              accessToken,
              channelId: entityId,
              numberOfMessages: Math.min(
                remainingMessagesCount,
                MAX_MESSAGE_NUMBER,
              ),
              fromStart: numberOfStarterMessage,
            }),
          );
        }
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
      },
    );

    observer.observe(firstMessageElementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [messages, entityId, remainingMessagesCount, numberOfStarterMessage]);

  return {
    messages,
    messagesStatus,
    firstMessageElementRef,
  };
};
