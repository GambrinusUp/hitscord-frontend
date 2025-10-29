import { useEffect, useRef } from 'react';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import {
  getChatInfo,
  getChatMessages,
  getMoreChatMessages,
  readChatMessageWs,
} from '~/entities/chat';
import { MessageType } from '~/entities/message';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useChannelData, useChatData } from '~/shared/lib/hooks';
import { useWebSocket } from '~/shared/lib/websocket';
import { getMoreMessages, readMessageWs } from '~/store/ServerStore';

/* Переписать */
export const useMessages = (
  scrollRef: React.RefObject<HTMLDivElement>,
  type: MessageType,
) => {
  const dispatch = useAppDispatch();
  const { readMessage } = useWebSocket();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { currentChannelId, currentServerId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const textChannels = useAppSelector(
    (state) => state.testServerStore.serverData.channels.textChannels,
  );
  const lastReadedMessageId =
    textChannels.find((channel) => channel.channelId === currentChannelId)
      ?.lastReadedMessageId || 0;

  const chatData = useChatData();
  const channelData = useChannelData();

  const {
    messages,
    messagesStatus,
    startMessageId,
    lastTopMessageId,
    lastBottomMessageId,
    remainingBottomMessagesCount,
    remainingTopMessagesCount,
    entityId,
  } = type === MessageType.CHAT ? chatData : channelData;

  const firstMessageElementRef = useRef<HTMLDivElement | null>(null);
  const lastMessageElementRef = useRef<HTMLDivElement | null>(null);

  const isLoadingTop = useRef(false);
  const prevScrollHeightRef = useRef<number | null>(null);

  useEffect(() => {
    if (type === MessageType.CHAT && activeChat) {
      dispatch(getChatInfo({ chatId: activeChat }));
    }
  }, [activeChat]);

  // Вызывается два раза/ много раз, возможно при смене active chat не сбрасывается chat.chatId
  useEffect(() => {
    if (!entityId) return;

    if (type === MessageType.CHAT) {
      const isFirstLoad = startMessageId === 0;

      dispatch(
        getChatMessages({
          chatId: entityId,
          number: MAX_MESSAGE_NUMBER,
          fromMessageId: startMessageId,
          down: isFirstLoad,
        }),
      );
    }
  }, [entityId, startMessageId]);

  useEffect(() => {
    if (!firstMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;

        if (remainingTopMessagesCount < 1) return;

        if (isLoadingTop.current) return;

        isLoadingTop.current = true;

        const numberToLoad = Math.min(
          remainingTopMessagesCount,
          MAX_MESSAGE_NUMBER,
        );

        if (scrollRef.current) {
          prevScrollHeightRef.current = scrollRef.current.scrollHeight;
        }

        if (type === MessageType.CHANNEL && entityId) {
          await dispatch(
            getMoreMessages({
              accessToken,
              channelId: entityId,
              number: numberToLoad + 1,
              fromMessageId: lastTopMessageId,
              down: false,
            }),
          );
        }

        requestAnimationFrame(() => {
          if (!scrollRef.current || prevScrollHeightRef.current === null) {
            return;
          }

          const newScrollHeight = scrollRef.current.scrollHeight;
          const diff = newScrollHeight - prevScrollHeightRef.current;

          scrollRef.current.scrollTop = diff;
          prevScrollHeightRef.current = null;
          isLoadingTop.current = false;
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
      },
    );

    observer.observe(firstMessageElementRef.current);

    return () => observer.disconnect();
  }, [entityId, remainingTopMessagesCount, lastTopMessageId]);

  useEffect(() => {
    if (!lastMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (remainingBottomMessagesCount < 1) return;

        const numberToLoad = Math.min(
          remainingBottomMessagesCount,
          MAX_MESSAGE_NUMBER,
        );

        if (type === MessageType.CHAT && entityId) {
          dispatch(
            getMoreChatMessages({
              chatId: entityId,
              number: numberToLoad + 1,
              fromMessageId: lastBottomMessageId,
              down: true,
            }),
          );
        }

        if (type === MessageType.CHANNEL && entityId) {
          dispatch(
            getMoreMessages({
              accessToken,
              channelId: entityId,
              number: numberToLoad + 1,
              fromMessageId: lastBottomMessageId,
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
  }, [entityId, remainingBottomMessagesCount, lastBottomMessageId]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          //console.log(entry.isIntersecting, lastReadedMessageId);

          if (entry.isIntersecting) {
            const messageId = Number(
              entry.target.getAttribute('data-message-id'),
            );

            const isChannel = type === MessageType.CHANNEL;
            const targetId = isChannel ? currentChannelId : activeChat;

            if (!targetId) return;

            if (messageId > lastReadedMessageId) {
              readMessage({
                Token: accessToken,
                isChannel: isChannel,
                MessageId: messageId,
                ChannelId: targetId,
              });

              if (isChannel) {
                dispatch(
                  readMessageWs({
                    readChannelId: targetId,
                    readedMessageId: messageId,
                    serverId: currentServerId,
                  }),
                );
              } else {
                dispatch(
                  readChatMessageWs({
                    readChatId: targetId,
                    readedMessageId: messageId,
                  }),
                );
              }
            }
          }
        });
      },
      { threshold: 0.5, root: scrollRef.current },
    );

    messages.forEach((message) => {
      const element = document.querySelector(
        `[data-message-id="${message.id}"]`,
      );

      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [messages, lastReadedMessageId]);

  return {
    messages,
    messagesStatus,
    firstMessageElementRef,
    lastMessageElementRef,
  };
};
