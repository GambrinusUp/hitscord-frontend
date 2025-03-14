export interface UserItemProps {
  socketId: string;
  userName: string;
  isStreaming: boolean;
  handleUserClick: (socketId: string) => void;
}
