import { FileResponse } from '~/entities/files';
import { LoadingState } from '~/shared/types';

export interface Chat {
  chatId: string;
  chatName: string;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  lastReadedMessageId: number;
  icon: FileResponse | null;
}

export interface GetChats {
  chatsList: Chat[];
}

export interface UserInChat {
  chatId: string;
  userId: string;
  userName: string;
  userTag: string;
  icon: FileResponse | null;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
  isFriend: boolean;
}

export interface ChatInfo {
  chatId: string;
  chatName: string;
  users: UserInChat[];
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  lastReadedMessageId: number;
  nonNotifiable: boolean;
  icon: FileResponse | null;
}

export enum MessageType {
  Classic,
  Vote,
}

export interface MessageFile {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

/* Вынести в shared */
export interface ReplyMessage {
  messageType: MessageType;
  serverId: string | null;
  channelId: string;
  id: number;
  authorId: string;
  createdAt: string;
  text: string;
}

export interface ChatMessage {
  text: string;
  modifiedAt: string | null;
  nestedChannel: string | null;
  files: MessageFile[] | null;
  messageType: MessageType;
  serverId: string | null;
  channelId: string;
  id: number;
  authorId: string;
  createdAt: string;
  replyToMessage: ReplyMessage | null;
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
  remainingTopMessagesCount: number;
  lastTopMessageId: number;
  remainingBottomMessagesCount: number;
  lastBottomMessageId: number;
  startMessageId: number;
  allMessagesCount: number;
  error: string;
}

export interface GetChatMessages {
  messages: ChatMessage[];
  numberOfMessages: number;
  startMessageId: number;
  remainingMessagesCount: number;
  allMessagesCount: number;
}

export interface GetMessagesParams {
  chatId: string;
  number: number;
  fromMessageId: number;
  down: boolean;
}
