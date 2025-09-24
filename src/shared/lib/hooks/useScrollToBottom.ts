import { useState, useCallback, useEffect, useRef } from 'react';

import { LoadingState } from '~/shared/types';

interface UseScrollToBottomProps {
  messagesStatus: LoadingState;
  dependencies?: unknown[];
}

export const useScrollToBottom = ({
  messagesStatus,
  dependencies = [],
}: UseScrollToBottomProps) => {
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
