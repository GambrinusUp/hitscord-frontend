import { ChannelType } from '~/store/ServerStore';

export interface SettingsChannelModalProps {
  opened: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
  channelType: ChannelType;
}
