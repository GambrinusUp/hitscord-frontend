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
import { v4 as uuidv4 } from 'uuid';

import MessageItem from '../../components/MessageItem/MessageItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addMessage } from '../../store/server/ServerSlice';

interface ChatSectionProps {
  openSidebar: () => void;
  openDetailsPanel: () => void;
}

const ChatSection = ({ openSidebar, openDetailsPanel }: ChatSectionProps) => {
  const dispatch = useAppDispatch();
  const { servers, currentChannelId, currentServerId } = useAppSelector(
    (state) => state.serverStore
  );
  const { user } = useAppSelector((state) => state.userStore);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() && currentServerId && currentChannelId) {
      const newGuid = uuidv4();
      dispatch(
        addMessage({
          serverId: currentServerId,
          channelId: currentChannelId,
          message: {
            id: newGuid,
            content: newMessage,
            userId: user.name,
            userName: user.name,
            timestamp: new Date().toISOString(),
            isOwnMessage: true,
          },
        })
      );
      setNewMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
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
          {servers['channel1'].textChannels[
            currentChannelId || 'General'
          ].messages.map((message) => (
            <MessageItem
              key={message.id}
              userName={message.userName}
              content={message.content}
              isOwnMessage={message.isOwnMessage}
              time={message.timestamp}
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
          onKeyDownCapture={handleKeyDown}
        />
        <ActionIcon size="xl" variant="transparent" onClick={handleSendMessage}>
          <Send size={20} />
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default ChatSection;
