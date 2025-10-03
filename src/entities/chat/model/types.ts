import { FileResponse } from '~/entities/files';
import { LoadingState } from '~/shared/types';

export interface Chat {
  chatId: string;
  chatName: string;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  lastReadedMessageId: number;
  icon: FileResponse;
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

export interface ChatMessage {
  text: string;
  modifiedAt: string | null;
  nestedChannel: string | null;
  files: MessageFile[] | null;
  messageType: MessageType;
  serverId: string | null;
  channelId: string;
  id: string;
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
  numberOfMessages: number;
  startMessageId: number;
  remainingMessagesCount: number;
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
