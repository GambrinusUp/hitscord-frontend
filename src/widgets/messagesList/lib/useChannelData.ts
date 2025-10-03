import { useAppSelector } from '~/hooks';

export const useChannelData = () => {
  return useAppSelector((state) => ({
    messages: state.testServerStore.messages,
    messagesStatus: state.testServerStore.messagesStatus,
    remainingMessagesCount: state.testServerStore.remainingMessagesCount,
    startMessageId: state.testServerStore.startMessageId,
    allMessagesCount: state.testServerStore.allMessagesCount,
    entityId: state.testServerStore.currentChannelId,
  }));
};
