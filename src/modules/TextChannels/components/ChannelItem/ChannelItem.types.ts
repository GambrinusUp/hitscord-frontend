export interface ChannelItemProps {
  channelId: string;
  currentChannelId: string | null;
  channelName: string;
  canWorkChannels: boolean;
  nonReadedCount: number;
  handleOpenChannel: () => void;
  handleEditChannel: () => void;
}
