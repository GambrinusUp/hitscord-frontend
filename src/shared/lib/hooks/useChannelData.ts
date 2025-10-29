import { useAppSelector } from '~/hooks';

export const useChannelData = () => {
  const messages = useAppSelector((state) => state.testServerStore.messages);
  const messagesStatus = useAppSelector(
    (state) => state.testServerStore.messageIsLoading,
  );
  const remainingTopMessagesCount = useAppSelector(
    (state) => state.testServerStore.remainingTopMessagesCount,
  );
  const lastTopMessageId = useAppSelector(
    (state) => state.testServerStore.lastTopMessageId,
  );
  const remainingBottomMessagesCount = useAppSelector(
    (state) => state.testServerStore.remainingBottomMessagesCount,
  );
  const lastBottomMessageId = useAppSelector(
    (state) => state.testServerStore.lastBottomMessageId,
  );
  const startMessageId = useAppSelector(
    (state) => state.testServerStore.startMessageId,
  );
  const allMessagesCount = useAppSelector(
    (state) => state.testServerStore.allMessagesCount,
  );
  const entityId = useAppSelector(
    (state) => state.testServerStore.currentChannelId,
  );

  return {
    messages,
    messagesStatus,
    remainingTopMessagesCount,
    lastTopMessageId,
    remainingBottomMessagesCount,
    lastBottomMessageId,
    startMessageId,
    allMessagesCount,
    entityId,
  };
};
