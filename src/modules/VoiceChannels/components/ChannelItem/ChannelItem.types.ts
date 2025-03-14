export interface ChannelItemProps {
  channelId: string;
  channelName: string;
  isAdmin: boolean;
  handleConnect: () => void;
  handleEditChannel: () => void;
}
