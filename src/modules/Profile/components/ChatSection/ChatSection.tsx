import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowDown,
  ArrowLeft,
  LogOut,
  Pencil,
  Send,
  UserPlus,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ChatProps } from './ChatSection.types';

import { MessageItem } from '~/components/MessageItem';
import { MAX_MESSAGE_NUMBER } from '~/constants';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { AddUserInChat } from '~/modules/Profile/components/AddUserInChat';
import { ChangeChatName } from '~/modules/Profile/components/ChangeChatName';
import { LoadingState } from '~/shared';
import {
  Chat,
  getChatInfo,
  getChatMessages,
  getMoreChatMessages,
  goOutFromChat,
  setActiveChat,
} from '~/store/ChatsStore';
import { MessageType } from '~/store/ServerStore/ServerStore.types';

export const ChatSection = ({
  chatId,
  sendChatMessage,
  editChatMessage,
  deleteChatMessage,
}: ChatProps) => {
  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const {
    messages,
    chat,
    messagesStatus,
    remainingMessagesCount,
    numberOfStarterMessage,
    messageIsLoading,
  } = useAppSelector((state) => state.chatsStore);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedAddUserModal,
    { open: openAddUserModal, close: closeAddUserModal },
  ] = useDisclosure(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const [newMessage, setNewMessage] = useState('');

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const firstMessageElementRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() && chatId) {
      console.log(newMessage);
      sendChatMessage({
        Token: accessToken,
        ChannelId: chat.chatId,
        Classic: { Text: newMessage.trim(), NestedChannel: false },

        MessageType: MessageType.Classic,
      });
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

  const handleChangeName = () => {
    setCurrentChat(chat);
    open();
  };

  const handleBack = () => {
    dispatch(setActiveChat(null));
  };

  const handleGoOut = async () => {
    if (chatId) {
      const result = await dispatch(goOutFromChat({ accessToken, id: chatId }));

      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(setActiveChat(null));
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
      //dispatch(clearHasNewMessage());
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
    if (chatId) {
      dispatch(getChatInfo({ accessToken, chatId }));
    }
  }, [chatId]);

  useEffect(() => {
    if (!firstMessageElementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (remainingMessagesCount > 0) {
            dispatch(
              getMoreChatMessages({
                accessToken,
                chatId: chatId!,
                number:
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

  useEffect(() => {
    if (chatId && accessToken) {
      dispatch(
        getChatMessages({
          accessToken,
          chatId: chatId,
          number: MAX_MESSAGE_NUMBER,
          fromStart: numberOfStarterMessage,
        }),
      );
    }
  }, [accessToken, chatId]);

  return (
    <>
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
                <ActionIcon
                  variant="subtle"
                  aria-label="Edit"
                  onClick={handleChangeName}
                >
                  <Pencil size={20} />
                </ActionIcon>
              </Group>
              <Text size="xs" c="dimmed">
                {chat.users.length} участников
              </Text>
            </Stack>
          </Group>
          <Group>
            <Button
              leftSection={<UserPlus />}
              variant="subtle"
              onClick={openAddUserModal}
            >
              Добавить пользователя
            </Button>
            <Button
              leftSection={<LogOut />}
              variant="subtle"
              color="red"
              onClick={handleGoOut}
            >
              Покинуть чат
            </Button>
          </Group>
        </Group>
        <Divider my="md" />
        <ScrollArea
          viewportRef={scrollRef}
          style={{ flex: 1, padding: 10 }}
          onScrollPositionChange={handleScroll}
        >
          <Stack gap="sm">
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
                  editMessage={editChatMessage}
                  deleteMessage={deleteChatMessage}
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
                }
              }}
            >
              <ArrowDown size={20} />
            </ActionIcon>
          </Box>
        )}

        <Box pos="relative">
          <Group mt="auto" align="center" wrap="nowrap" gap={0}>
            <Textarea
              w="100%"
              placeholder="Написать..."
              value={newMessage}
              onChange={(event) => setNewMessage(event.currentTarget.value)}
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
      <ChangeChatName
        opened={opened}
        close={close}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
      />
      <AddUserInChat opened={openedAddUserModal} close={closeAddUserModal} />
    </>
  );
};
