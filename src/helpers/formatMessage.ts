import { ChatMessage, MessageFile } from '~/entities/chat';
import { ChannelMessage } from '~/store/ServerStore';
import { MessageType, ReplyMessage } from '~/store/ServerStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatMessageFile = (rawFile: any): MessageFile => ({
  fileId: rawFile.FileId, // FileId -> fileId
  fileName: rawFile.FileName, // FileName -> fileName
  fileType: rawFile.FileType, // FileType -> fileType
  fileSize: rawFile.FileSize, // FileSize -> fileSize
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatReplyMessage = (rawMessage: any): ReplyMessage => ({
  messageType: MessageType.Classic,
  serverId: rawMessage.ServerId || null,
  channelId: rawMessage.ChannelId,
  id: rawMessage.Id,
  authorId: rawMessage.AuthorId,
  createdAt: rawMessage.CreatedAt,
  text: rawMessage.Text,
});

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
  replyToMessage: rawMessage.ReplyToMessage
    ? formatReplyMessage(rawMessage.ReplyToMessage)
    : null,
  messageType: MessageType.Classic,
  files: rawMessage.Files ? rawMessage.Files.map(formatMessageFile) : null,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatChatMessage = (rawMessage: any): ChatMessage => ({
  text: rawMessage.Text,
  modifiedAt: rawMessage.ModifiedAt || null,
  id: rawMessage.Id,
  authorId: rawMessage.AuthorId,
  createdAt: rawMessage.CreatedAt,
  replyToMessage: rawMessage.ReplyToMessage ? rawMessage.ReplyToMessage : null,
  files: rawMessage.Files ? rawMessage.Files.map(formatMessageFile) : null,
  nestedChannel: rawMessage.NestedChannelId || null,
  messageType: MessageType.Classic,
  serverId: rawMessage.ServerId,
  channelId: rawMessage.ChannelId,
});
