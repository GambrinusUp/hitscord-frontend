/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  ScrollArea,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { ArrowLeftFromLine, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { useAppDispatch } from '../../hooks/redux';
import { toggleUserStreamView } from '../../store/app/AppSettingsSlice';
import { getUserGroups } from './utils/getUserGroups';

interface User {
  socketId: string;
  producerId: string;
  userName: string;
}

interface UserStreamProps {
  users: User[];
  consumers: any[];
  onOpenStream: (stream: MediaStream) => void;
}

const UserStream = ({ users, consumers, onOpenStream }: UserStreamProps) => {
  const dispatch = useAppDispatch();
  const userGroups = getUserGroups(users);

  const handleUserClick = (socketId: string) => {
    const isStreaming = userGroups[socketId].producerIds.length > 1;

    if (isStreaming) {
      const videoConsumer = consumers.find(
        (consumer) =>
          consumer.kind === 'video' &&
          userGroups[socketId].producerIds.includes(consumer.producerId)
      );

      if (videoConsumer) {
        const stream = new MediaStream([videoConsumer.track]);
        onOpenStream(stream);
      }
    }
  };

  return (
    <ScrollArea style={{ flex: 1, maxHeight: '100%' }}>
      <Group justify="flex-end">
        <ActionIcon
          variant="transparent"
          onClick={() => dispatch(toggleUserStreamView())}
        >
          <ArrowLeftFromLine />
        </ActionIcon>
      </Group>
      <SimpleGrid cols={{ base: 2, lg: 3 }} spacing="sm">
        {Object.entries(userGroups).map(
          ([socketId, { userName, producerIds }]) => {
            const isStreaming = producerIds.length > 1;
            return (
              <Box
                key={socketId}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#1A1B1E',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Avatar radius="xl" size="lg" color="blue">
                  {userName[0]}
                </Avatar>
                <Text c="white">{userName}</Text>
                {isStreaming && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleUserClick(socketId)}
                  >
                    Открыть стрим
                  </Button>
                )}
              </Box>
            );
          }
        )}
      </SimpleGrid>
    </ScrollArea>
  );
};

interface ChatSectionWithUsersProps {
  users: User[];
  consumers: any[];
}

const ChatSectionWithUsers = ({
  users,
  consumers,
}: ChatSectionWithUsersProps) => {
  const [selectedStream, setSelectedStream] = useState<MediaStream | null>(
    null
  );

  const handleOpenStream = (stream: MediaStream) => {
    setSelectedStream(stream);
  };

  const handleCloseStream = () => {
    setSelectedStream(null);
  };

  const userGroups = getUserGroups(users);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
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
      {selectedStream ? (
        <Box style={{ position: 'relative', flex: 1 }}>
          <video
            autoPlay
            style={{
              width: '100%',
              height: 'calc(100% - 80px)',
              borderRadius: '8px',
            }}
            ref={(el) => {
              if (el) el.srcObject = selectedStream;
            }}
          />
          <Button
            variant="filled"
            color="red"
            onClick={handleCloseStream}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1,
            }}
          >
            <X size={20} /> Закрыть
          </Button>
          {/* Панель со списком пользователей внизу */}
          <Box
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              variant="subtle"
              color="gray"
              onClick={scrollLeft}
              style={{ zIndex: 1 }}
            >
              <ChevronLeft size={20} />
            </Button>

            <ScrollArea viewportRef={scrollRef} style={{ width: '100%' }}>
              <Flex style={{ minWidth: '100%', gap: '8px', padding: '8px' }}>
                {Object.entries(userGroups).map(([socketId, { userName }]) => (
                  <Box
                    key={socketId}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#1A1B1E',
                      textAlign: 'center',
                      height: '100px',
                      width: '100px',
                    }}
                  >
                    <Avatar radius="xl" size="sm">
                      {userName[0]}
                    </Avatar>
                    <Text c="white" size="xs">
                      {userName}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </ScrollArea>

            <Button
              variant="subtle"
              color="gray"
              onClick={scrollRight}
              style={{ zIndex: 1 }}
            >
              <ChevronRight size={20} />
            </Button>
          </Box>
        </Box>
      ) : (
        <UserStream
          users={users}
          consumers={consumers}
          onOpenStream={handleOpenStream}
        />
      )}
    </Box>
  );
};

export default ChatSectionWithUsers;
