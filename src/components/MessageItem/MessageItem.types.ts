import { DeleteMessageWs, EditMessageWs } from '~/store/ServerStore';

export interface MessageItemProps {
  isOwnMessage: boolean;
  content: string;
  time: string;
  messageId: string;
  authorId: string;
  modifiedAt?: string | null;
  editMessage: (message: EditMessageWs) => void;
  deleteMessage: (message: DeleteMessageWs) => void;
}
