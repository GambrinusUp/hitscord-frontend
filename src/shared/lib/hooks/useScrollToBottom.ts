import { useState, useCallback, useEffect, useRef } from 'react';

import { useAppDispatch } from '~/hooks';
import { LoadingState } from '~/shared/types';
import { clearHasNewMessage } from '~/store/ServerStore';

interface UseScrollToBottomProps {
  messagesStatus: LoadingState;
  dependencies?: unknown[];
  type?: 'chat' | 'channel';
}

export const useScrollToBottom = ({
  messagesStatus,
  dependencies = [],
  type = 'chat',
}: UseScrollToBottomProps) => {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    setIsAtBottom(atBottom);

    if (atBottom) {
      setShowButton(false);
    }
  }, [scrollRef]);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      if (!scrollRef.current) return;

      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
      setShowButton(false);
    },
    [scrollRef],
  );

  useEffect(() => {
    if (!isAtBottom) {
      setShowButton(true);
    } else if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });

      if (type === 'channel') {
        dispatch(clearHasNewMessage());
      }
    }
  }, [...dependencies, isAtBottom, scrollToBottom]);

  useEffect(() => {
    if (messagesStatus === LoadingState.FULFILLED && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'instant',
      });
    }
  }, [messagesStatus]);

  return {
    scrollRef,
    isAtBottom,
    showButton,
    handleScroll,
    scrollToBottom,
  };
};
