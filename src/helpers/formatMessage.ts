import { ChatMessage, MessageFile } from '~/entities/chat';
import { MessageType, VoteVariant, ReplyMessage } from '~/store/ServerStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatMessageFile = (rawFile: any): MessageFile => ({
  fileId: rawFile.FileId, // FileId -> fileId
  fileName: rawFile.FileName, // FileName -> fileName
  fileType: rawFile.FileType, // FileType -> fileType
  fileSize: rawFile.FileSize, // FileSize -> fileSize
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatReplyMessage = (rawMessage: any): ReplyMessage => ({
  messageType: MessageType.Classic,
  serverId: rawMessage.ServerId || null,
  channelId: rawMessage.ChannelId,
  id: rawMessage.Id,
  authorId: rawMessage.AuthorId,
  createdAt: rawMessage.CreatedAt,
  text: rawMessage.Text,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatVoteVariant = (rawVariant: any): VoteVariant => ({
  id: rawVariant.Id,
  number: rawVariant.Number,
  content: rawVariant.Content,
  totalVotes: rawVariant.TotalVotes,
  votedUserIds: rawVariant.VotedUserIds, // Предполагается массив строк/чисел
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/*export const formatMessage = (rawMessage: any): ChannelMessage => {
  let messageType: MessageType = MessageType.Classic;
  let poll: Poll | null = null;

  if (rawMessage.MessageType === 'Vote') {
    messageType = MessageType.Vote;
    poll = formatPoll(rawMessage);
  }

  if (rawMessage.Payload && rawMessage.Payload.MessageType === 'Vote') {
    messageType = MessageType.Vote;
    poll = formatPoll(rawMessage.Payload);
    const text = rawMessage.Payload.Content;
    const commonFields = {
      text: text,
      modifiedAt: rawMessage.Payload.ModifiedAt || null,
      nestedChannel: rawMessage.Payload.NestedChannelId || null,
      files: rawMessage.Payload.Files
        ? rawMessage.Payload.Files.map(formatMessageFile)
        : null,
      messageType: messageType,
      serverId: rawMessage.Payload.ServerId || null,
      channelId: rawMessage.Payload.ChannelId,
      id: rawMessage.Payload.Id,
      authorId: rawMessage.Payload.AuthorId,
      createdAt: rawMessage.Payload.CreatedAt,
      replyToMessage: rawMessage.Payload.ReplyToMessage
        ? formatReplyMessage(rawMessage.Payload.ReplyToMessage)
        : null,
      poll: poll,
    };

    return commonFields;
  } else {
    return {
      text: rawMessage.Payload.Text,
      modifiedAt: rawMessage.Payload.ModifiedAt || null,
      nestedChannel: rawMessage.Payload.NestedChannelId || null,
      files: rawMessage.Payload.Files
        ? rawMessage.Payload.Files.map(formatMessageFile)
        : null,
      messageType: MessageType.Classic,
      serverId: rawMessage.Payload.ServerId || null,
      channelId: rawMessage.Payload.ChannelId,
      id: rawMessage.Payload.Id,
      authorId: rawMessage.Payload.AuthorId,
      createdAt: rawMessage.Payload.CreatedAt,
      replyToMessage: rawMessage.Payload.ReplyToMessage
        ? formatReplyMessage(rawMessage.Payload.ReplyToMessage)
        : null,
      poll: null,
    };
  }
};*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatMessage = (rawMessage: any): ChatMessage => {
  const messageType = rawMessage.MessageType;

  const baseMessage = {
    messageType: messageType,
    serverId: rawMessage.ServerId || null,
    serverName: rawMessage.ServerName || null,
    channelId: rawMessage.ChannelId,
    channelName: rawMessage.ChannelName || null,
    id: rawMessage.Id,
    authorId: rawMessage.AuthorId,
    createdAt: rawMessage.CreatedAt,
    replyToMessage: rawMessage.ReplyToMessage
      ? formatReplyMessage(rawMessage.ReplyToMessage)
      : null,
  };

  if (messageType === MessageType.Classic) {
    return {
      ...baseMessage,
      text: rawMessage.Text || null,
      modifiedAt: rawMessage.ModifiedAt || null,
      nestedChannel: rawMessage.NestedChannel || null,
      files: rawMessage.Files ? rawMessage.Files.map(formatMessageFile) : null,
    };
  } else if (messageType === MessageType.Vote) {
    return {
      ...baseMessage,
      title: rawMessage.Title || null,
      content: rawMessage.Content || null,
      isAnonimous: rawMessage.IsAnonimous || false,
      multiple: rawMessage.Multiple || false,
      deadline: rawMessage.Deadline || null,
      variants: rawMessage.Variants
        ? rawMessage.Variants.map(formatVoteVariant)
        : [],
    };
  }

  return {
    ...baseMessage,
    text: rawMessage.Text || null,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatChatMessage = (rawMessage: any): ChatMessage => {
  const messageType = rawMessage.MessageType;

  const baseMessage = {
    messageType: messageType,
    serverId: rawMessage.ServerId || null,
    serverName: rawMessage.ServerName || null,
    channelId: rawMessage.ChannelId,
    channelName: rawMessage.ChannelName || null,
    id: rawMessage.Id,
    authorId: rawMessage.AuthorId,
    createdAt: rawMessage.CreatedAt,
    replyToMessage: rawMessage.ReplyToMessage
      ? formatReplyMessage(rawMessage.ReplyToMessage)
      : null,
  };

  if (messageType === MessageType.Classic) {
    return {
      ...baseMessage,
      text: rawMessage.Text || null,
      modifiedAt: rawMessage.ModifiedAt || null,
      nestedChannel: rawMessage.NestedChannel || null,
      files: rawMessage.Files ? rawMessage.Files.map(formatMessageFile) : null,
    };
  } else if (messageType === MessageType.Vote) {
    return {
      ...baseMessage,
      title: rawMessage.Title || null,
      content: rawMessage.Content || null,
      isAnonimous: rawMessage.IsAnonimous || false,
      multiple: rawMessage.Multiple || false,
      deadline: rawMessage.Deadline || null,
      variants: rawMessage.Variants
        ? rawMessage.Variants.map(formatVoteVariant)
        : [],
    };
  }

  return {
    ...baseMessage,
    text: rawMessage.Text || null,
  };
};
