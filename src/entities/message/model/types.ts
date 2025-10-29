import { MessageFile } from '~/entities/chat';
import { ReplyMessage } from '~/store/ServerStore';

export enum MessageType {
  CHAT = 'CHAT',
  CHANNEL = 'CHANNEL',
}

export interface MessageItemProps {
  id: number;
  type: MessageType;
  isOwnMessage: boolean;
  content: string;
  replyMessage: ReplyMessage | null;
  time: string;
  authorId: string;
  channelId: string;
  modifiedAt?: string | null;
  files: MessageFile[] | null;
  onReplyMessage: () => void;
  EditActions?: React.FC<{
    editedContent: string;
    setIsEditing: (value: boolean) => void;
  }>;
  DeleteActions?: React.FC<{
    setIsEditing: (value: boolean) => void;
  }>;
}
