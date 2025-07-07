export interface ChannelItemProps {
  channelId: string;
  channelName: string;
  currentCount: number;
  maxCount: number;
  canWorkChannels: boolean;
  handleConnect: () => void;
}
