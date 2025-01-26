import {
  ActionIcon,
  Box,
  Divider,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { Menu, Paperclip, Search, Send, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import MessageItem from '../../components/MessageItem/MessageItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createMessage } from '../../store/server/ServerActionCreators';

interface ChatSectionProps {
  openSidebar: () => void;
  openDetailsPanel: () => void;
}

const ChatSection = ({ openSidebar, openDetailsPanel }: ChatSectionProps) => {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const { currentServerId, currentChannelId, messages, isLoading } =
    useAppSelector((state) => state.testServerStore);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() && currentServerId && currentChannelId) {
      dispatch(
        createMessage({
          accessToken: accessToken,
          channelId: currentChannelId,
          text: newMessage.trim(),
          nestedChannel: false,
        })
      );
      setNewMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

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
      <ScrollArea viewportRef={scrollRef} style={{ flex: 1, padding: 10 }}>
        <Stack gap="sm">
          {isLoading &&
            messages.length < 1 &&
            Array.from({ length: 5 }).map((_, index) => (
              <Group align="flex-start" gap="xs" key={index}>
                <Skeleton height={40} width={40} circle />
                <Box style={{ flex: 1 }}>
                  <Skeleton height={12} width="60%" radius="md" />
                  <Skeleton height={10} width="40%" mt={8} radius="md" />
                </Box>
              </Group>
            ))}
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              messageId={message.id}
              userName={message.authorName}
              content={message.text}
              isOwnMessage={user.id === message.authorId}
              time={message.createdAt}
              modifiedAt={message.modifiedAt}
            />
          ))}
        </Stack>
      </ScrollArea>
      <Group mt="auto" align="center" wrap="nowrap" gap={0}>
        <ActionIcon size="xl" variant="transparent">
          <Paperclip size={20} />
        </ActionIcon>
        <Textarea
          w="100%"
          placeholder="Написать..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDownCapture={handleKeyDown}
          autosize
          minRows={1}
          maxRows={3}
        />
        <ActionIcon size="xl" variant="transparent" onClick={handleSendMessage}>
          <Send size={20} />
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default ChatSection;
