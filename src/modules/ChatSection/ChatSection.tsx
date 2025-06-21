import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  Indicator,
  Loader,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { ArrowDown, Menu, Paperclip, Search, Send, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ChatSectionProps, MentionSuggestion } from './ChatSection.types';
import { formatUserTagMessage } from './ChatSection.utils';

import { MessageItem } from '~/components/MessageItem';
import { MAX_MESSAGE_NUMBER } from '~/constants';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import {
  clearHasNewMessage,
  getMoreMessages,
  UserOnServer,
} from '~/store/ServerStore';

export const ChatSection = ({
  openSidebar,
  openDetailsPanel,
  sendMessage,
  editMessage,
  deleteMessage,
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
    serverData,
    remainingMessagesCount,
    numberOfStarterMessage,
    messageIsLoading,
  } = useAppSelector((state) => state.testServerStore);
  const users = serverData.users;
  const [newMessage, setNewMessage] = useState('');

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<UserOnServer[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [currentMention, setCurrentMention] =
    useState<MentionSuggestion | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const firstMessageElementRef = useRef<HTMLDivElement | null>(null);

  const findMentionAtCursor = (
    text: string,
    cursorPosition: number,
  ): MentionSuggestion | null => {
    const beforeCursor = text.slice(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/#(\w*)$/);

    if (mentionMatch) {
      const searchText = mentionMatch[1];
      const startIndex = beforeCursor.lastIndexOf('#');

      return {
        user: {} as UserOnServer,
        startIndex,
        searchText,
      };
    }

    return null;
  };

  const filterUsers = (searchText: string): UserOnServer[] => {
    if (!searchText) return users.slice(0, 5);

    return users
      .filter(
        (user) =>
          user.userName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.userTag.toLowerCase().includes(searchText.toLowerCase()),
      )
      .slice(0, 5);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentServerId && currentChannelId) {
      console.log(formatUserTagMessage(newMessage.trim()));
      sendMessage({
        Token: accessToken,
        ChannelId: currentChannelId,
        Text: formatUserTagMessage(newMessage.trim()),
        NestedChannel: false,
      });
      setNewMessage('');
      setShowSuggestions(false);
      setCurrentMention(null);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    setNewMessage(value);

    const mention = findMentionAtCursor(value, cursorPosition);

    if (mention) {
      const filteredUsers = filterUsers(mention.searchText);
      setSuggestions(filteredUsers);
      setCurrentMention(mention);
      setShowSuggestions(filteredUsers.length > 0);
      setSelectedSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
      setCurrentMention(null);
    }
  };

  const insertMention = (user: UserOnServer) => {
    if (!currentMention || !textareaRef.current) return;

    const beforeMention = newMessage.slice(0, currentMention.startIndex);
    const afterMention = newMessage.slice(
      textareaRef.current.selectionStart || 0,
    );
    const mentionText = `#${user.userTag} `;

    const newText = beforeMention + mentionText + afterMention;
    setNewMessage(newText);
    setShowSuggestions(false);
    setCurrentMention(null);

    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = beforeMention.length + mentionText.length;
        textareaRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition,
        );
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }

      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;

      case 'Tab':
      case 'Enter':
        event.preventDefault();

        if (suggestions[selectedSuggestionIndex]) {
          insertMention(suggestions[selectedSuggestionIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        setShowSuggestions(false);
        setCurrentMention(null);
        break;
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

  useEffect(() => {
    if (suggestionsRef.current && showSuggestions) {
      const selectedElement = suggestionsRef.current.children[
        selectedSuggestionIndex
      ] as HTMLElement;

      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedSuggestionIndex, showSuggestions]);

  useEffect(() => {
    if (!firstMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('moreMessages');

          if (remainingMessagesCount > 0) {
            dispatch(
              getMoreMessages({
                accessToken,
                channelId: currentChannelId!,
                numberOfMessages:
                  remainingMessagesCount > MAX_MESSAGE_NUMBER
                    ? MAX_MESSAGE_NUMBER
                    : remainingMessagesCount,
                fromStart: numberOfStarterMessage,
              }),
            );
          }
        }
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
      },
    );

    observer.observe(firstMessageElementRef.current);

    return () => {
      observer.disconnect();
    };
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
          {messageIsLoading === LoadingState.PENDING && <Loader />}
          {messages.map((message, index) => (
            <div
              ref={index === 0 ? firstMessageElementRef : null}
              key={message.id}
            >
              <MessageItem
                messageId={message.id}
                content={message.text}
                isOwnMessage={user.id === message.authorId}
                time={message.createdAt}
                modifiedAt={message.modifiedAt}
                authorId={message.authorId}
                editMessage={editMessage}
                deleteMessage={deleteMessage}
              />
            </div>
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

      <Box pos="relative">
        {/* Выпадающий список с предложениями */}
        {showSuggestions && suggestions.length > 0 && (
          <Paper
            ref={suggestionsRef}
            shadow="md"
            p="xs"
            pos="absolute"
            bottom="100%"
            left={0}
            right={0}
            mb="xs"
            mah={200}
            bg="#43474f"
            style={{ overflow: 'auto', zIndex: 1000 }}
          >
            <Stack gap="xs">
              {suggestions.map((user, index) => (
                <Group
                  key={user.userId}
                  p="xs"
                  style={{
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor:
                      index === selectedSuggestionIndex
                        ? 'var(--mantine-color-blue-light)'
                        : 'transparent',
                  }}
                  onClick={() => insertMention(user)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <Avatar size="sm" color="blue">
                    {user.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Text size="sm" fw={500}>
                      {user.userName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      #{user.userTag} • {user.roleName}
                    </Text>
                  </Box>
                </Group>
              ))}
            </Stack>
          </Paper>
        )}

        <Group mt="auto" align="center" wrap="nowrap" gap={0}>
          <ActionIcon size="xl" variant="transparent">
            <Paperclip size={20} />
          </ActionIcon>
          <Textarea
            ref={textareaRef}
            w="100%"
            placeholder="Написать..."
            value={newMessage}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            autosize
            minRows={1}
            maxRows={3}
          />
          <ActionIcon
            size="xl"
            variant="transparent"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
};
