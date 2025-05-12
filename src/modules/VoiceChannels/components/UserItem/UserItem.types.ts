export interface UserItemProps {
  socketId: string;
  isSpeaking: boolean;
  userName: string;
  producerIds: string[];
  isAdmin: boolean;
  userVolume: number;
  handleOpenStream: (socketId: string) => void;
  handleVolumeChange: (socketId: string, value: number) => void;
  handleKickUser: (socketId: string) => void;
  channelId: string;
  userId?: string;
}
