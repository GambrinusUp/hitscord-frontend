import { ChannelMessage } from '../utils/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatMessage = (rawMessage: any): ChannelMessage => ({
  serverId: rawMessage.ServerId,
  channelId: rawMessage.ChannelId,
  id: rawMessage.Id,
  text: rawMessage.Text,
  authorId: rawMessage.AuthorId,
  authorName: rawMessage.AuthorName,
  createdAt: rawMessage.CreatedAt,
  modifiedAt: rawMessage.ModifiedAt || null,
  nestedChannelId: rawMessage.NestedChannelId || null,
  replyToMessage: rawMessage.ReplyToMessage || null,
});
