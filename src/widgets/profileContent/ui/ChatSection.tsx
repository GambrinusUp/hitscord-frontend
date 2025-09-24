import {
  ActionIcon,
  Stack,
  Text,
  Title,
  Divider,
  ScrollArea,
  Box,
  Group,
} from '@mantine/core';
import { ArrowLeft, ArrowDown } from 'lucide-react';

import { setActiveChat } from '~/entities/chat';
import { AddUserToChat } from '~/features/addUserToChat';
import { AttachedFilesList } from '~/features/attachedFilesList';
import { ChangeChatName } from '~/features/changeChatName';
import { MessagesList } from '~/features/getChatMessages';
import { LeaveChat } from '~/features/leaveChat';
import { SendMessageForm } from '~/features/sendMessageToChat';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useScrollToBottom } from '~/shared/lib/hooks';

export const ChatSection = () => {
  const dispatch = useAppDispatch();
  const { messages, chat, messagesStatus } = useAppSelector(
    (state) => state.chatsStore,
  );
  const { scrollRef, isAtBottom, showButton, handleScroll, scrollToBottom } =
    useScrollToBottom({ messagesStatus, dependencies: [messages] });

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
        <MessagesList scrollRef={scrollRef} />
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
        <SendMessageForm />
      </Box>
    </Box>
  );
};
