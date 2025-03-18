import { EditModal } from '~/shared';
import { ChannelType } from '~/store/ServerStore';

export interface CreateChannelModalProps {
  opened: boolean;
  onClose: () => void;
  isEdit: EditModal;
  serverId: string;
  channelType: ChannelType;
}
