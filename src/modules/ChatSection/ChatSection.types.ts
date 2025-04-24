import {
  CreateMessageWs,
  DeleteMessageWs,
  EditMessageWs,
} from '~/store/ServerStore';

export interface ChatSectionProps {
  openSidebar: () => void;
  openDetailsPanel: () => void;
  sendMessage: (message: CreateMessageWs) => void;
  editMessage: (message: EditMessageWs) => void;
  deleteMessage: (message: DeleteMessageWs) => void;
}
