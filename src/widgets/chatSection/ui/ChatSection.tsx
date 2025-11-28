import {
  ActionIcon,
  Stack,
  Title,
  Divider,
  ScrollArea,
  Text,
  Box,
  Group,
  Notification,
} from '@mantine/core';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import { useState } from 'react';

import { ChatMessage, setActiveChat } from '~/entities/chat';
import { MessageType, useMessageAuthor } from '~/entities/message';
import { AttachedFilesList } from '~/features/attachedFilesList';
import { AddUserToChat, ChangeChatName, LeaveChat } from '~/features/chat';
import { CreatePoll } from '~/features/polls';
import { SendMessageForm } from '~/features/sendMessageToChat';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useScrollToBottom } from '~/shared/lib/hooks';
import { ChannelMessage } from '~/store/ServerStore';

interface ChatSectionProps {
  MessagesList: React.ComponentType<{
    scrollRef: React.RefObject<HTMLDivElement>;
    type: MessageType;
    replyToMessage: (message: ChatMessage) => void;
  }>;
}

export const ChatSection = ({ MessagesList }: ChatSectionProps) => {
  const dispatch = useAppDispatch();
  const { messages, chat, messagesStatus } = useAppSelector(
    (state) => state.chatsStore,
  );
  const { scrollRef, isAtBottom, showButton, handleScroll, scrollToBottom } =
    useScrollToBottom({ messagesStatus, dependencies: [messages] });
  const { getUsername } = useMessageAuthor(MessageType.CHAT);

  const [replyMessage, setReplyMessage] = useState<
    ChatMessage | ChannelMessage | null
  >(null);

  const handleBack = () => {
    dispatch(setActiveChat(null));
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
        <Group align="center">
          <ActionIcon variant="subtle" aria-label="Back" onClick={handleBack}>
            <ArrowLeft size={20} />
          </ActionIcon>
          <Stack gap={0}>
            <Group>
              <Title order={4}>{chat.chatName}</Title>
              <ChangeChatName />
            </Group>
            <Text size="xs" c="dimmed">
              {chat.users.length} участников
            </Text>
          </Stack>
        </Group>
        <Group>
          <AddUserToChat />
          <LeaveChat chatId={chat.chatId} />
        </Group>
      </Group>
      <Divider my="md" />
      <ScrollArea
        viewportRef={scrollRef}
        style={{ flex: 1, padding: 10 }}
        onScrollPositionChange={handleScroll}
      >
        <MessagesList
          scrollRef={scrollRef}
          type={MessageType.CHAT}
          replyToMessage={(message) => setReplyMessage(message)}
        />
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
          <ActionIcon
            size="lg"
            variant="filled"
            onClick={() => scrollToBottom()}
          >
            <ArrowDown size={20} />
          </ActionIcon>
        </Box>
      )}
      <Box pos="relative">
        <AttachedFilesList />
        {replyMessage && (
          <Box p={6}>
            <Notification
              title={getUsername(replyMessage.authorId)}
              onClose={() => setReplyMessage(null)}
            >
              <Text lineClamp={2}>
                {replyMessage.text || replyMessage.title}
              </Text>
            </Notification>
          </Box>
        )}
        <SendMessageForm
          CreatePoll={CreatePoll}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
        />
      </Box>
    </Box>
  );
};
