import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Indicator,
  ScrollArea,
  Skeleton,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { ArrowDown, Menu, Paperclip, Search, Send, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ChatSectionProps } from './ChatSection.types';

import { MessageItem } from '~/components/MessageItem';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { clearHasNewMessage, createMessage } from '~/store/ServerStore';

export const ChatSection = ({
  openSidebar,
  openDetailsPanel,
}: ChatSectionProps) => {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const {
    currentServerId,
    currentChannelId,
    messages,
    hasNewMessage,
    isLoading,
    messagesStatus,
  } = useAppSelector((state) => state.testServerStore);
  const [newMessage, setNewMessage] = useState('');

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentServerId && currentChannelId) {
      dispatch(
        createMessage({
          accessToken: accessToken,
          channelId: currentChannelId,
          text: newMessage.trim(),
          nestedChannel: false,
        }),
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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      setIsAtBottom(atBottom);

      if (atBottom) {
        setShowButton(false);
      }
    }
  };

  useEffect(() => {
    if (!isAtBottom) {
      setShowButton(true);
    } else if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
      dispatch(clearHasNewMessage());
    }
  }, [messages, isAtBottom]);

  useEffect(() => {
    if (messagesStatus === LoadingState.FULFILLED && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'instant',
      });
    }
  }, [messagesStatus]);

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
      <ScrollArea
        viewportRef={scrollRef}
        style={{ flex: 1, padding: 10 }}
        onScrollPositionChange={handleScroll}
      >
        <Stack gap="sm">
          {isLoading &&
            messages.length < 1 &&
            Array.from({ length: 5 }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
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

      {!isAtBottom && showButton && (
        <Box
          style={{
            position: 'absolute',
            bottom: 60,
            right: 320,
            zIndex: 10,
          }}
        >
          <Indicator size={14} disabled={!hasNewMessage} withBorder>
            <ActionIcon
              size="lg"
              variant="filled"
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth',
                  });
                  setShowButton(false);
                  dispatch(clearHasNewMessage());
                }
              }}
            >
              <ArrowDown size={20} />
            </ActionIcon>
          </Indicator>
        </Box>
      )}

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
