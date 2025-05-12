import { Box, Button, Flex, ScrollArea } from '@mantine/core';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { UserItem } from './components/UserItem';
import { UsersCards } from './components/UsersCards';

import { socket } from '~/api/socket';
import { useMediaContext } from '~/context/';
import { getUserGroups } from '~/helpers';
import { useAppSelector } from '~/hooks';

export const ChatSectionWithUsers = () => {
  const { consumers, users, selectedUserId, setSelectedUserId } =
    useMediaContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const selectedStreamRef = useRef<MediaStream | null>(null);
  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const rooms = getUserGroups(users);
  const currentRoom = rooms.find(
    (room) => room.roomName === currentVoiceChannelId,
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
          currentRoom.users[selectedUserId!]?.producerIds.includes(producerId),
      );

      if (isStreamSelected) {
        handleCloseStream();
      }
    };

    socket.on('producerClosed', onProducerClosed);

    return () => {
      socket.off('producerClosed', onProducerClosed);
    };
  }, [socket, consumers, currentRoom, selectedUserId]);

  /*useEffect(() => {
    if (!selectedUserId || !currentRoom) return;

    const videoConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'video' &&
        currentRoom.users[selectedUserId]?.producerIds.includes(
          consumer.producerId,
        ),
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
              console.error('Ошибка воспроизведения видео:', err),
            );
        }
      }
    }
  }, [selectedUserId, consumers, currentRoom]);*/

  useEffect(() => {
    if (!selectedUserId || !currentRoom) return;

    const userProducerIds =
      currentRoom.users[selectedUserId]?.producerIds ?? [];

    const videoConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'video' &&
        userProducerIds.includes(consumer.producerId),
    );

    const audioConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'audio' &&
        consumer.appData?.source === 'screen-audio' &&
        userProducerIds.includes(consumer.producerId),
    );

    const tracks: MediaStreamTrack[] = [];

    if (videoConsumer?.track) tracks.push(videoConsumer.track);

    if (audioConsumer?.track) tracks.push(audioConsumer.track);

    if (tracks.length > 0) {
      const newStream = new MediaStream(tracks);
      selectedStreamRef.current = newStream;

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current
          .play()
          .catch((err) =>
            console.error('Ошибка воспроизведения видео/аудио:', err),
          );
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
                        <UserItem
                          key={socketId}
                          socketId={socketId}
                          userName={userName}
                          isStreaming={isStreaming}
                          handleUserClick={handleUserClick}
                        />
                      );
                    },
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
        <UsersCards users={users} onOpenStream={handleUserClick} />
      )}
    </Box>
  );
};
