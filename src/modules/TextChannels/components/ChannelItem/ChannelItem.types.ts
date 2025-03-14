export interface ChannelItemProps {
  channelId: string;
  currentChannelId: string | null;
  channelName: string;
  isAdmin: boolean;
  handleOpenChannel: () => void;
  handleEditChannel: () => void;
}
