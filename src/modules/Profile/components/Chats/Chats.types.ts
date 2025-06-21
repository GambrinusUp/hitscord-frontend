import {
  CreateMessageWs,
  DeleteMessageWs,
  EditMessageWs,
} from '~/store/ServerStore';

export interface ChatsProps {
  sendChatMessage: (message: CreateMessageWs) => void;
  editChatMessage: (message: EditMessageWs) => void;
  deleteChatMessage: (message: DeleteMessageWs) => void;
}
