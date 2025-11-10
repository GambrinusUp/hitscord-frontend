import { MessageFile } from '~/entities/chat';
import { ReplyMessage } from '~/store/ServerStore';

export enum MessageType {
  CHAT = 'CHAT',
  CHANNEL = 'CHANNEL',
}

export interface MessageItemProps {
  type: MessageType;
  isOwnMessage: boolean;
  content: string;
  replyMessage: ReplyMessage | null;
  time: string;
  authorId: string;
  channelId: string;
  modifiedAt?: string | null;
  files: MessageFile[] | null | undefined;
  onReplyMessage: () => void;
  EditMessage?: React.FC<{
    editedContent: string;
    setEditedContent: (value: React.SetStateAction<string>) => void;
    setIsEditing: (value: boolean) => void;
  }>;
  MessageActions?: React.FC<{
    setIsEditing: (value: boolean) => void;
    setEditedContent: (value: React.SetStateAction<string>) => void;
    messageContent: string;
  }>;
}
