import {
  Stack,
  Title,
  Button,
  ScrollArea,
  Card,
  Group,
  Loader,
} from '@mantine/core';
import { MessageCircle, Plus } from 'lucide-react';
import { useEffect } from 'react';

import { getChats, setActiveChat } from '~/entities/chat';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';

interface ChatsListProps {
  onCreateChatClick: () => void;
}

export const ChatsList = ({ onCreateChatClick }: ChatsListProps) => {
  const dispatch = useAppDispatch();
  const { chatsList, chatsLoading } = useAppSelector(
    (state) => state.chatsStore,
  );

  const handleOpenChat = (chatId: string) => {
    dispatch(setActiveChat(chatId));
  };

  useEffect(() => {
    dispatch(getChats());
  }, []);

  return (
    <Stack w="100%" gap="md" p="md">
      <Group justify="space-between">
        <Title order={1}>Чаты</Title>
        <Button leftSection={<Plus />} onClick={onCreateChatClick}>
          Создать чат
        </Button>
      </Group>
      <ScrollArea style={{ flex: 1, maxHeight: '100%' }}>
        <Stack gap="xs">
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
          {chatsLoading === LoadingState.PENDING && <Loader />}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};
