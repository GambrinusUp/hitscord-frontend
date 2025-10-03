import { useEffect, useRef } from 'react';

import { useChannelData } from './useChannelData';
import { useChatData } from './useChatData';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import {
  getChatInfo,
  getChatMessages,
  getMoreChatMessages,
} from '~/entities/chat';
import { MessageType } from '~/entities/message';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { getMoreMessages } from '~/store/ServerStore';

/* Переписать */
export const useMessages = (
  scrollRef: React.RefObject<HTMLDivElement>,
  type: MessageType,
) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);

  //const chatData = useChatData();
  const channelData = useChannelData();

  const {
    messages,
    messagesStatus,
    remainingMessagesCount,
    startMessageId,
    allMessagesCount,
    entityId,
    //} = type === MessageType.CHAT ? chatData : channelData;
  } = channelData;

  const firstMessageElementRef = useRef<HTMLDivElement | null>(null);
  const lastMessageElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (type === MessageType.CHAT && activeChat) {
      dispatch(getChatInfo({ chatId: activeChat }));
    }
  }, [activeChat]);

  // Вызывается два раза/ много раз, возможно при смене active chat не сбрасывается chat.chatId
  useEffect(() => {
    if (!entityId) return;

    if (type === MessageType.CHAT) {
      dispatch(
        getChatMessages({
          chatId: entityId,
          number: MAX_MESSAGE_NUMBER,
          fromMessageId: 2,
          down: false,
        }),
      );
    }
  }, [entityId]);

  useEffect(() => {
    if (!firstMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const messagesAbove = startMessageId - 1;

        if (messagesAbove < 1) return;

        const numberToLoad = Math.min(messagesAbove, MAX_MESSAGE_NUMBER);

        /*if (type === MessageType.CHAT && entityId) {
          dispatch(
            getMoreChatMessages({
              chatId: entityId,
              number: Math.min(remainingMessagesCount, MAX_MESSAGE_NUMBER),
              fromStart: numberOfStarterMessage,
            }),
          );
        }*/

        if (type === MessageType.CHANNEL && entityId) {
          dispatch(
            getMoreMessages({
              accessToken,
              channelId: entityId,
              number: numberToLoad,
              fromMessageId: startMessageId,
              down: false,
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
  }, [messages, entityId, remainingMessagesCount, startMessageId]);

  useEffect(() => {
    if (!lastMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        /*if (type === MessageType.CHAT && entityId) {
          const lastMessageId = messages[messages.length - 1]?.id;
          
          if (lastMessageId && lastReadedMessageId && lastMessageId < lastReadedMessageId) {
            dispatch(
              getMoreChatMessages({
                chatId: entityId,
                number: MAX_MESSAGE_NUMBER,
                fromMessageId: lastMessageId,
                down: true, // Подгружаем вниз (новые)
              }),
            );
          }
        }*/

          if()

        if (type === MessageType.CHANNEL && entityId) {
          const lastMessageId = messages[messages.length - 1]?.id;

          dispatch(
            getMoreMessages({
              accessToken,
              channelId: entityId,
              number: MAX_MESSAGE_NUMBER,
              fromMessageId: lastMessageId,
              down: true,
            }),
          );
        }
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
      },
    );

    observer.observe(lastMessageElementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [messages, entityId, remainingMessagesCount, startMessageId]);

  return {
    messages,
    messagesStatus,
    firstMessageElementRef,
    lastMessageElementRef,
  };
};
