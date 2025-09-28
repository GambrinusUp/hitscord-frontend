import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  Indicator,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { ArrowDown, Menu, Paperclip, Search, Send, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ChatSectionProps, MentionSuggestion } from './ChatSection.types';
import { formatTagMessage } from './ChatSection.utils';

import { attachFile, clearFiles } from '~/entities/files';
import { MessageType } from '~/entities/message';
import { AttachedFilesList } from '~/features/attachedFilesList';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { useScrollToBottom } from '~/shared/lib/hooks';
import { useWebSocket } from '~/shared/lib/websocket';
import { MessageType as ServerMessageType } from '~/store/ServerStore';
import { MessagesList } from '~/widgets/messagesList';

export const ChatSection = ({
  openSidebar,
  openDetailsPanel,
}: ChatSectionProps) => {
  const dispatch = useAppDispatch();
  const { sendMessage } = useWebSocket();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const {
    currentServerId,
    currentChannelId,
    messages,
    hasNewMessage,
    messagesStatus,
    serverData,
  } = useAppSelector((state) => state.testServerStore);
  const { uploadedFiles, loading } = useAppSelector(
    (state) => state.filesStore,
  );
  const users = serverData.users;
  const roles = serverData.roles;
  const channelSettings = serverData.channels.textChannels.find(
    (channel) => channel.channelId === currentChannelId,
  );
  const { scrollRef, isAtBottom, showButton, handleScroll, scrollToBottom } =
    useScrollToBottom({
      messagesStatus,
      dependencies: [messages],
      type: 'channel',
    });

  const canWrite = channelSettings?.canWrite;
  const [newMessage, setNewMessage] = useState('');

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [currentMention, setCurrentMention] =
    useState<MentionSuggestion | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const findMentionAtCursor = (
    text: string,
    cursorPosition: number,
  ): MentionSuggestion | null => {
    const before = text.slice(0, cursorPosition);
    const match = before.match(/@([\w#-]*)$/);

    if (match) {
      const search = match[1];
      const atIndex = before.lastIndexOf('@');

      return {
        type: 'user',
        id: '',
        display: '',
        tag: '',
        startIndex: atIndex,
        searchText: search,
      };
    }

    return null;
  };

  const filterSuggestions = (
    mention: MentionSuggestion,
  ): MentionSuggestion[] => {
    const text = mention.searchText.toLowerCase();

    const userMatches = users
      .filter((u) => `${u.userName}#${u.userTag}`.toLowerCase().includes(text))
      .slice(0, 5)
      .map((u) => ({
        type: 'user' as const,
        id: u.userId,
        display: u.userName,
        tag: `${u.userTag}`,
        startIndex: mention.startIndex,
        searchText: mention.searchText,
      }));

    const roleMatches = roles
      .filter(
        (r) =>
          r.name.toLowerCase().includes(text) ||
          r.tag.toLowerCase().includes(text),
      )
      .slice(0, 5)
      .map((r) => ({
        type: 'role' as const,
        id: r.id,
        display: r.name,
        tag: r.tag,
        startIndex: mention.startIndex,
        searchText: mention.searchText,
      }));

    return [...userMatches, ...roleMatches];
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentServerId && currentChannelId) {
      console.log(formatTagMessage(newMessage.trim()));
      sendMessage({
        Token: accessToken,
        ChannelId: currentChannelId,
        Classic: {
          Text: newMessage.trim(),
          NestedChannel: false,
          Files: uploadedFiles.map((file) => file.fileId),
        },

        MessageType: ServerMessageType.Classic,
      });
      setNewMessage('');
      setShowSuggestions(false);
      setCurrentMention(null);
      dispatch(clearFiles());
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart || 0;
    setNewMessage(val);
    const mention = findMentionAtCursor(val, pos);

    if (mention) {
      const list = filterSuggestions(mention);
      setSuggestions(list);
      setCurrentMention(mention);
      setShowSuggestions(list.length > 0);
      setSelectedSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
      setCurrentMention(null);
    }
  };

  const insertMention = (item: MentionSuggestion) => {
    if (!currentMention || !textareaRef.current) return;

    console.log('insertMention', item);

    const before = newMessage.slice(0, currentMention.startIndex);
    const after = newMessage.slice(textareaRef.current.selectionStart || 0);
    const mentionText =
      item.type === 'user' ? `@${item.tag} ` : `@${item.tag} `;
    const updated = before + mentionText + after;
    setNewMessage(updated);
    setShowSuggestions(false);
    setCurrentMention(null);
    setTimeout(() => {
      const pos = before.length + mentionText.length;
      textareaRef.current!.setSelectionRange(pos, pos);
      textareaRef.current!.focus();
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !currentChannelId) return;

    for (const file of Array.from(e.target.files)) {
      await dispatch(
        attachFile({ channelId: currentChannelId, file }),
      ).unwrap();
    }

    e.target.value = '';
  };

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
        <MessagesList scrollRef={scrollRef} type={MessageType.CHANNEL} />
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
              onClick={() => scrollToBottom()}
            >
              <ArrowDown size={20} />
            </ActionIcon>
          </Indicator>
        </Box>
      )}

      <Box pos="relative">
        <AttachedFilesList />

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
              {suggestions.map((item, index) => (
                <Group
                  key={item.id}
                  p="xs"
                  style={{
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor:
                      index === selectedSuggestionIndex
                        ? 'var(--mantine-color-blue-light)'
                        : 'transparent',
                  }}
                  onClick={() => insertMention(item)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <Avatar size="sm" color="blue">
                    {item.display.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Text size="sm" fw={500}>
                      {item.display}
                    </Text>
                    <Text size="xs" c="dimmed">
                      @{item.tag} • {item.type}
                    </Text>
                  </Box>
                </Group>
              ))}
            </Stack>
          </Paper>
        )}

        <Group mt="auto" align="center" wrap="nowrap" gap={0}>
          {canWrite && (
            <ActionIcon
              component="label"
              size="xl"
              variant="transparent"
              disabled={loading === LoadingState.PENDING}
            >
              <Paperclip size={20} />
              <input type="file" hidden multiple onChange={handleFileChange} />
            </ActionIcon>
          )}
          <Textarea
            ref={textareaRef}
            w="100%"
            placeholder="Написать..."
            value={newMessage}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            autosize
            disabled={!canWrite}
            minRows={1}
            maxRows={3}
          />
          {canWrite && (
            <ActionIcon
              size="xl"
              variant="transparent"
              onClick={handleSendMessage}
            >
              <Send size={20} />
            </ActionIcon>
          )}
        </Group>
      </Box>
    </Box>
  );
};
