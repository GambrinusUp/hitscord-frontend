export interface MessageItemProps {
  isOwnMessage: boolean;
  userName: string;
  content: string;
  time: string;
  messageId: string;
  modifiedAt?: string | null;
}
