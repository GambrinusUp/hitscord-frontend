import { Button, Card, Group, Loader, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MessageCircle, Plus } from 'lucide-react';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { CreateChat } from '~/modules/Profile/components/CreateChat';
import { LoadingState } from '~/shared';
import { getChats, setActiveChat } from '~/store/ChatsStore';

export const ChatsList = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { chatsList, chatsLoading } = useAppSelector(
    (state) => state.chatsStore,
  );
  const [opened, { open, close }] = useDisclosure(false);

  const handleOpenChat = (chatId: string) => {
    dispatch(setActiveChat(chatId));
  };

  useEffect(() => {
    dispatch(getChats({ accessToken }));
  }, [accessToken]);

  return (
    <>
      <Stack w="100%" gap="md" p="md">
        <Group justify="space-between">
          <Title order={1}>Чаты</Title>
          <Button leftSection={<Plus />} onClick={open}>
            Создать чат
          </Button>
        </Group>
        <Stack gap="xs">
          {chatsLoading === LoadingState.PENDING && <Loader />}
          {chatsList.map((chat) => (
            <Card
              key={chat.chatId}
              bg="#1a1b1e"
              padding="xs"
              radius="md"
              c="#fff"
              p="md"
            >
              <Stack>
                <Group wrap="nowrap">
                  <MessageCircle size={24} style={{ flexShrink: 0 }} />
                  <Title order={3}>{chat.chatName}</Title>
                </Group>
                <Button
                  variant="light"
                  radius="md"
                  onClick={() => handleOpenChat(chat.chatId)}
                >
                  Открыть чат
                </Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
      <CreateChat opened={opened} close={close} />
    </>
  );
};
