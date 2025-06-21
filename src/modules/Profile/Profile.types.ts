import {
  CreateMessageWs,
  DeleteMessageWs,
  EditMessageWs,
} from '~/store/ServerStore';

export interface ProfileProps {
  sendChatMessage: (message: CreateMessageWs) => void;
  editChatMessage: (message: EditMessageWs) => void;
  deleteChatMessage: (message: DeleteMessageWs) => void;
}
