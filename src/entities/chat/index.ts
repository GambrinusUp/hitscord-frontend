export type { Chat } from './model/types';

export {
  getChats,
  getChatInfo,
  getChatMessages,
  getMoreChatMessages,
  createChat,
  changeChatName,
  addUserInChat,
  goOutFromChat,
} from './model/actions';

export { chatsReducer, setActiveChat } from './model/slice';
