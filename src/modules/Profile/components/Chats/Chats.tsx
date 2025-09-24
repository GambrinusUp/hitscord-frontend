import { useDisclosure } from '@mantine/hooks';

import { ChatsProps } from './Chats.types';

import { CreateChat } from '~/features/createChat';
import { ChatsList } from '~/features/getChatsList';
import { useAppSelector } from '~/hooks';
import { ChatSection } from '~/modules/Profile/components/ChatSection';

export const Chats = ({
  sendChatMessage,
  editChatMessage,
  deleteChatMessage,
}: ChatsProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { activeChat } = useAppSelector((state) => state.chatsStore);

  return (
    <>
      {!activeChat ? (
        <>
          <ChatsList onCreateChatClick={open} />
          <CreateChat opened={opened} onClose={close} />
        </>
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
