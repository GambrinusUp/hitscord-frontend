import { LoadingState } from '~/shared';
import { MessageType } from '~/store/ServerStore/ServerStore.types';

export interface Chat {
  chatId: string;
  chatName: string;
}

export interface GetChats {
  chatsList: Chat[];
}

export interface UserInChat {
  userId: string;
  userName: string;
  userTag: string;
  mail: string;
  icon: Base64URLString | null;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
}

export interface ChatInfo {
  chatId: string;
  chatName: string;
  users: UserInChat[];
}

export interface ChatMessage {
  text: string;
  modifiedAt: string | null;
  nestedChannel: string | null;
  files: unknown[] | null;
  messageType: MessageType;
  serverId: string | null;
  channelId: string;
  id: number;
  authorId: string;
  createdAt: string;
  replyToMessage: string | null;
}

export interface ChatsState {
  chatsList: Chat[];
  chatsLoading: LoadingState;
  chat: ChatInfo;
  activeChat: string | null;
  chatLoading: LoadingState;
  messages: ChatMessage[];
  messagesStatus: LoadingState;
  messageIsLoading: LoadingState;
  numberOfStarterMessage: number;
  remainingMessagesCount: number;
  error: string;
}

export interface GetChatMessages {
  messages: ChatMessage[];
  numberOfMessages: number;
  numberOfStarterMessage: number;
  remainingMessagesCount: number;
  allMessagesCount: number;
}
