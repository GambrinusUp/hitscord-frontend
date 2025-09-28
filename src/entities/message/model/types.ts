import { MessageFile } from '~/entities/chat';

export enum MessageType {
  CHAT = 'CHAT',
  CHANNEL = 'CHANNEL',
}

export interface MessageItemProps {
  type: MessageType;
  isOwnMessage: boolean;
  content: string;
  time: string;
  authorId: string;
  channelId: string;
  modifiedAt?: string | null;
  files: MessageFile[] | null;
  EditActions?: React.FC<{
    editedContent: string;
    setIsEditing: (value: boolean) => void;
  }>;
  DeleteActions?: React.FC<{
    setIsEditing: (value: boolean) => void;
  }>;
}
