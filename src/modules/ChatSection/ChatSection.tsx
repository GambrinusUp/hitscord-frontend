import {
  ActionIcon,
  Box,
  Divider,
  Group,
  ScrollArea,
  Stack,
  TextInput,
} from '@mantine/core';
import { Menu, Paperclip, Search, Send, Users } from 'lucide-react';
import { useState } from 'react';

import Message from '../../components/Message/Message';

interface ChatSectionProps {
  openSidebar: () => void;
  openDetailsPanel: () => void;
}

const ChatSection = ({ openSidebar, openDetailsPanel }: ChatSectionProps) => {
  const [messages, setMessages] = useState([
    { userName: 'User1', content: 'Hello, how are you?', isOwnMessage: false },
    { userName: 'You', content: 'I am good, thanks!', isOwnMessage: true },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { userName: 'You', content: newMessage, isOwnMessage: true },
      ]);
      setNewMessage('');
    }
  };

  return (
    <Box
      style={{
        flex: 1,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2C2E33',
      }}
    >
      <Group align="center" gap="xs" wrap="nowrap" justify="space-between">
        <ActionIcon variant="transparent" onClick={openSidebar} hiddenFrom="sm">
          <Menu size={20} />
        </ActionIcon>
        <TextInput leftSection={<Search size={16} />} placeholder="Поиск..." />
        <ActionIcon
          variant="transparent"
          onClick={openDetailsPanel}
          hiddenFrom="sm"
        >
          <Users size={20} />
        </ActionIcon>
      </Group>
      <Divider my="md" />
      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="sm">
          {messages.map((msg, index) => (
            <Message
              key={index}
              userName={msg.userName}
              content={msg.content}
              isOwnMessage={msg.isOwnMessage}
            />
          ))}
        </Stack>
      </ScrollArea>
      <Group mt="auto" align="center" wrap="nowrap" gap={0}>
        <ActionIcon size="xl" variant="transparent">
          <Paperclip size={20} />
        </ActionIcon>
        <TextInput
          w="100%"
          placeholder="Написать..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <ActionIcon size="xl" variant="transparent" onClick={handleSendMessage}>
          <Send size={20} />
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default ChatSection;
