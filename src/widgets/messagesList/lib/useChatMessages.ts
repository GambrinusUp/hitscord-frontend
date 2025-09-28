import { useEffect, useRef } from 'react';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import {
  getChatInfo,
  getChatMessages,
  getMoreChatMessages,
} from '~/entities/chat';
import { useAppDispatch, useAppSelector } from '~/hooks';

export const useChatMessages = (scrollRef: React.RefObject<HTMLDivElement>) => {
  const dispatch = useAppDispatch();
  const {
    messages,
    remainingMessagesCount,
    numberOfStarterMessage,
    messagesStatus,
    activeChat,
    chat,
  } = useAppSelector((state) => state.chatsStore);

  const firstMessageElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeChat) {
      dispatch(getChatInfo({ chatId: activeChat }));
    }
  }, [activeChat]);

  useEffect(() => {
    if (chat.chatId) {
      dispatch(
        getChatMessages({
          chatId: chat.chatId,
          number: MAX_MESSAGE_NUMBER,
          fromStart: numberOfStarterMessage,
        }),
      );
    }
  }, [chat]);

  useEffect(() => {
    if (!firstMessageElementRef.current && chat.chatId) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && remainingMessagesCount > 0) {
          dispatch(
            getMoreChatMessages({
              chatId: chat.chatId,
              number: Math.min(remainingMessagesCount, MAX_MESSAGE_NUMBER),
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

    if (firstMessageElementRef.current) {
      observer.observe(firstMessageElementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [messages, chat]);

  return {
    messages,
    messagesStatus,
    firstMessageElementRef,
  };
};
