import { Button, Card, Group, Stack, Title } from '@mantine/core';
import { MessageCircle } from 'lucide-react';

import { Chat } from '~/entities/chat';

interface ChatItemProps {
  chat: Chat;
  openChat: (chatId: string) => void;
}

export const ChatItem = ({ chat, openChat }: ChatItemProps) => {
  const { chatId, chatName } = chat;

  return (
    <Card key={chatId} bg="#1a1b1e" padding="xs" radius="md" c="#fff" p="md">
      <Stack>
        <Group wrap="nowrap">
          <MessageCircle size={24} style={{ flexShrink: 0 }} />
          <Title order={3}>{chatName}</Title>
        </Group>
        <Button
          variant="light"
          radius="md"
          onClick={() => openChat(chat.chatId)}
        >
          Открыть чат
        </Button>
      </Stack>
    </Card>
  );
};
