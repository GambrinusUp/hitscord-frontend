import { Chat } from '~/store/ChatsStore';

export interface ChangeChatNameProps {
  opened: boolean;
  close: () => void;
  currentChat: Chat | null;
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>;
}
