import {
  CreateMessageWs,
  DeleteMessageWs,
  EditMessageWs,
} from '~/store/ServerStore';

export interface ChatProps {
  chatId: string | null;
  sendChatMessage: (message: CreateMessageWs) => void;
  editChatMessage: (message: EditMessageWs) => void;
  deleteChatMessage: (message: DeleteMessageWs) => void;
}
