import { useDisclosure } from '@mantine/hooks';

import { CreateChat } from '~/features/createChat';
import { ChatsList } from '~/features/getChatsList';

export const ChatsPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ChatsList onCreateChatClick={open} />
      <CreateChat opened={opened} onClose={close} />
    </>
  );
};
