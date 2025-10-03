import { useAppSelector } from '~/hooks';

export const useChatData = () => {
  return useAppSelector((state) => ({
    messages: state.chatsStore.messages,
    messagesStatus: state.chatsStore.messagesStatus,
    /*remainingMessagesCount: state.chatsStore.remainingMessagesCount,
    numberOfStarterMessage: state.chatsStore.numberOfStarterMessage,
    entityId: state.chatsStore.chat.chatId,*/
  }));
};
