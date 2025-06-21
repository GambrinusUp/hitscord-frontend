export interface ChannelItemProps {
  channelId: string;
  channelName: string;
  currentCount: number;
  maxCount: number;
  isAdmin: boolean;
  handleConnect: () => void;
}
