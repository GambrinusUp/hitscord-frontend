import { useDisclosure } from '@mantine/hooks';

import { ChatSection } from './ChatSection';

import { CreateChat } from '~/features/createChat';
import { ChatsList } from '~/features/getChatsList';
import { useAppSelector } from '~/hooks';

export const ChatSwitcher = () => {
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
        <ChatSection />
      )}
    </>
  );
};
