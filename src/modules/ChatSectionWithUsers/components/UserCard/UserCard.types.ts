export interface UserCardProps {
  socketId: string;
  userName: string;
  isStreaming: boolean;
  onOpenStream: (socketId: string) => void;
}
