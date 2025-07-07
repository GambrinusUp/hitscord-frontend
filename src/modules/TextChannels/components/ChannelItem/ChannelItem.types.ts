export interface ChannelItemProps {
  channelId: string;
  currentChannelId: string | null;
  channelName: string;
  canWorkChannels: boolean;
  handleOpenChannel: () => void;
  handleEditChannel: () => void;
}
