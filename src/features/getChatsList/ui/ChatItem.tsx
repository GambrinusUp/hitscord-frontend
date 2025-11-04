import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ArrowRight } from 'lucide-react';

import { Chat, setActiveChat } from '~/entities/chat';
import { useAppDispatch } from '~/hooks';

interface ChatItemProps {
  chat: Chat;
}

export const ChatItem = ({ chat }: ChatItemProps) => {
  const dispatch = useAppDispatch();

  const { chatName, nonReadedCount, nonReadedTaggedCount, chatId } = chat;

  const handleOpenChat = () => {
    dispatch(setActiveChat(chatId));
  };

  return (
    <Card bg="#1a1b1e" padding="xs" radius="md" c="#fff" p="md" w="100%">
      <Group justify="space-between">
        <Group>
          <Avatar src={null} alt="no image here" size="xl" />
          <Stack>
            <Title order={3}>{chatName}</Title>
            <Group>
              {nonReadedCount < 1 ? (
                <Text>Нет новых сообщений</Text>
              ) : (
                <>
                  <Badge color="blue">{nonReadedCount} новых</Badge>
                  {nonReadedTaggedCount > 0 && (
                    <Badge color="red">{nonReadedTaggedCount}</Badge>
                  )}
                </>
              )}
            </Group>
          </Stack>
        </Group>
        <Button
          variant="light"
          radius="md"
          leftSection={<ArrowRight />}
          onClick={handleOpenChat}
        >
          Открыть чат
        </Button>
      </Group>
    </Card>
  );
};
