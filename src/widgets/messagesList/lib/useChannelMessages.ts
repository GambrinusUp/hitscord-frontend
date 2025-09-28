import { useEffect, useRef } from 'react';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { getMoreMessages } from '~/store/ServerStore';

export const useChannelMessages = (
  scrollRef: React.RefObject<HTMLDivElement>,
) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const {
    currentChannelId,
    messages,
    messagesStatus,
    remainingMessagesCount,
    numberOfStarterMessage,
  } = useAppSelector((state) => state.testServerStore);

  const firstMessageElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!firstMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && remainingMessagesCount > 0) {
          dispatch(
            getMoreMessages({
              accessToken,
              channelId: currentChannelId!,
              numberOfMessages:
                remainingMessagesCount > MAX_MESSAGE_NUMBER
                  ? MAX_MESSAGE_NUMBER
                  : remainingMessagesCount,
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
  }, [messages]);

  return {
    messages,
    messagesStatus,
    firstMessageElementRef,
  };
};
