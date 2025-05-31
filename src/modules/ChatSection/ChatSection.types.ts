import {
  CreateMessageWs,
  DeleteMessageWs,
  EditMessageWs,
  UserOnServer,
} from '~/store/ServerStore';

export interface ChatSectionProps {
  openSidebar: () => void;
  openDetailsPanel: () => void;
  sendMessage: (message: CreateMessageWs) => void;
  editMessage: (message: EditMessageWs) => void;
  deleteMessage: (message: DeleteMessageWs) => void;
}

export interface MentionSuggestion {
  user: UserOnServer;
  startIndex: number;
  searchText: string;
}
