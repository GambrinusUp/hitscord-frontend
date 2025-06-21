import {
  CreateMessageWs,
  DeleteMessageWs,
  EditMessageWs,
} from '~/store/ServerStore';

export interface ProfileMessagesSectionProps {
  activeLink: 'friends' | 'settings' | 'chats';
  sendChatMessage: (message: CreateMessageWs) => void;
  editChatMessage: (message: EditMessageWs) => void;
  deleteChatMessage: (message: DeleteMessageWs) => void;
}
