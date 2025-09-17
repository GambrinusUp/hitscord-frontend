import { ChatMessage } from '~/store/ChatsStore';
import { ChannelMessage } from '~/store/ServerStore';
import { MessageType } from '~/store/ServerStore/ServerStore.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatMessage = (rawMessage: any): ChannelMessage => ({
  serverId: rawMessage.ServerId,
  channelId: rawMessage.ChannelId,
  id: rawMessage.Id,
  text: rawMessage.Text,
  authorId: rawMessage.AuthorId,
  createdAt: rawMessage.CreatedAt,
  modifiedAt: rawMessage.ModifiedAt || null,
  nestedChannelId: rawMessage.NestedChannelId || null,
  replyToMessage: rawMessage.ReplyToMessage || null,
  messageType: MessageType.Classic,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatChatMessage = (rawMessage: any): ChatMessage => ({
  chatId: rawMessage.ChatId,
  id: rawMessage.Id,
  text: rawMessage.Text,
  authorId: rawMessage.AuthorId,
  createdAt: rawMessage.CreatedAt,
  modifiedAt: rawMessage.ModifiedAt || null,
  replyToMessage: rawMessage.ReplyToMessage || null,
  files: rawMessage.Files || null,
});
