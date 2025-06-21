import { ChatsProps } from './Chats.types';

import { useAppSelector } from '~/hooks';
import { ChatSection } from '~/modules/Profile/components/ChatSection';
import { ChatsList } from '~/modules/Profile/components/ChatsList';

export const Chats = ({
  sendChatMessage,
  editChatMessage,
  deleteChatMessage,
}: ChatsProps) => {
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  //const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <>
      {!activeChat ? (
        <ChatsList />
      ) : (
        <ChatSection
          chatId={activeChat}
          sendChatMessage={sendChatMessage}
          editChatMessage={editChatMessage}
          deleteChatMessage={deleteChatMessage}
        />
      )}
    </>
  );
};
