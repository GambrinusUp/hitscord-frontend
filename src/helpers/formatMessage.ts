import { ChatMessage } from '~/entities/chat';
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
  nestedChannel: rawMessage.NestedChannelId || null,
  replyToMessage: rawMessage.ReplyToMessage || null,
  messageType: MessageType.Classic,
  files: rawMessage.Files || null,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatChatMessage = (rawMessage: any): ChatMessage => ({
  text: rawMessage.Text,
  modifiedAt: rawMessage.ModifiedAt || null,
  id: rawMessage.Id,
  authorId: rawMessage.AuthorId,
  createdAt: rawMessage.CreatedAt,
  replyToMessage: rawMessage.ReplyToMessage || null,
  files: rawMessage.Files || null,
  nestedChannel: rawMessage.NestedChannelId || null,
  messageType: MessageType.Classic,
  serverId: rawMessage.ServerId,
  channelId: rawMessage.ChannelId,
});
