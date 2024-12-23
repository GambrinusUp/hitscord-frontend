import { Avatar, Box, Button, Flex, ScrollArea, Text } from '@mantine/core';
import { ChevronLeft, ChevronRight, Video, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import socket from '../../api/socket';
import { useMediaContext } from '../../context/MediaContext/useMediaContext';
import { useAppSelector } from '../../hooks/redux';
import UsersCards from './components/UsersCards/UsersCards';
import { getUserGroups } from './utils/getUserGroups';

const ChatSectionWithUsers = () => {
  const { consumers, users, selectedUserId, setSelectedUserId } =
    useMediaContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const selectedStreamRef = useRef<MediaStream | null>(null);
  //const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore
  );
  const rooms = getUserGroups(users);
  const currentRoom = rooms.find(
    (room) => room.roomName === currentVoiceChannelId
  );
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

  const handleUserClick = (socketId: string) => {
    setSelectedUserId(socketId);
  };

  const handleCloseStream = () => {
    setSelectedUserId(null);
    if (videoRef.current) {
      selectedStreamRef.current = null;
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!socket || !currentRoom) return;

    const onProducerClosed = ({ producerId }: { producerId: string }) => {
      const isStreamSelected = consumers.some(
        (consumer) =>
          consumer.kind === 'video' &&
          consumer.producerId === producerId &&
          currentRoom.users[selectedUserId!]?.producerIds.includes(producerId)
      );

      if (isStreamSelected) {
        handleCloseStream();
      }
    };

    socket.on('producerClosed', onProducerClosed);

    return () => {
      socket.off('producerClosed', onProducerClosed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, consumers, currentRoom, selectedUserId]);

  useEffect(() => {
    if (!selectedUserId || !currentRoom) return;

    const videoConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'video' &&
        currentRoom.users[selectedUserId]?.producerIds.includes(
          consumer.producerId
        )
    );

    if (videoConsumer) {
      const newTrack = videoConsumer.track;
      if (
        !selectedStreamRef.current ||
        selectedStreamRef.current.getVideoTracks()[0]?.id !== newTrack.id
      ) {
        const newStream = new MediaStream([newTrack]);
        selectedStreamRef.current = newStream;

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current
            .play()
            .catch((err) =>
              console.error('Ошибка воспроизведения видео:', err)
            );
        }
      }
    }
  }, [selectedUserId, consumers, currentRoom]);

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
      {selectedUserId ? (
        <Box style={{ position: 'relative', flex: 1 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: 'calc(100% - 80px)',
              borderRadius: '8px',
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
                {currentRoom &&
                  Object.entries(currentRoom.users).map(
                    ([socketId, { userName, producerIds }]) => {
                      const isStreaming = producerIds.length > 1;
                      return (
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
                          {isStreaming && (
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleUserClick(socketId)}
                            >
                              <Video />
                            </Button>
                          )}
                        </Box>
                      );
                    }
                  )}
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
        <UsersCards
          users={users}
          //consumers={consumers}
          onOpenStream={handleUserClick}
        />
      )}
    </Box>
  );
};

export default ChatSectionWithUsers;
