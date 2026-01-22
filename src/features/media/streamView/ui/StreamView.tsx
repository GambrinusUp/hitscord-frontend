import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';

import { Panel } from './Panel';
import { Stream } from './Stream';
import { stylesStreamView } from './StreamView.style';

import { socket } from '~/api/socket';
import { useMediaContext } from '~/context';
import { VoiceUserCard } from '~/entities/media';
import { getStoredVolume } from '~/features/media/streamView/lib/getStoredVolume';
import { saveVolumeToStorage } from '~/features/media/streamView/lib/saveVolumeToStorage';
import { getUserGroups } from '~/helpers';
import { useAppSelector } from '~/hooks';
import { useStream, useSpeaking } from '~/shared/lib/hooks';

export const StreamView = () => {
  const [volume, setVolume] = useState<number>(1);
  const {
    consumers,
    users,
    selectedUserId,
    setSelectedUserId,
    previewUserIds,
    togglePreview,
  } = useMediaContext();
  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { calculateIsSpeaking, getIsMuted } = useSpeaking();

  const rooms = getUserGroups(users);
  const currentRoom = rooms.find(
    (room) => room.roomName === currentVoiceChannelId,
  );
  const selectedUserData = selectedUserId
    ? currentRoom?.users[selectedUserId]
    : null;
  const producerIds = selectedUserData?.producers.map(
    (producer) => producer.producerId,
  );

  const { videoRef } = useStream({
    isStreaming: !!selectedUserData,
    consumers,
    userProducerIds: producerIds ?? [],
    volume,
  });

  useEffect(() => {
    if (selectedUserId) {
      setVolume(getStoredVolume(selectedUserId));
    }
  }, [selectedUserId]);

  const handleUserClick = (socketId: string) => {
    setSelectedUserId(socketId);
  };

  const handleCloseStream = () => {
    setSelectedUserId(null);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handlePreviewStream = (socketId: string) => {
    togglePreview(socketId);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);

    if (selectedUserId) {
      saveVolumeToStorage(selectedUserId, newVolume);
    }
  };

  useEffect(() => {
    if (!socket || !currentRoom) return;

    const onProducerClosed = ({
      producerId,
    }: {
      producerId: string | undefined;
    }) => {
      let isStreamSelected = false;

      if (producerId) {
        isStreamSelected = consumers.some(
          (consumer) =>
            consumer.kind === 'video' &&
            consumer.producerId === producerId &&
            currentRoom.users[selectedUserId!]?.producers
              .map((producer) => producer.producerId)
              .includes(producerId),
        );
      } else {
        const room = users.find(
          (room) => room.roomName === currentVoiceChannelId,
        );

        if (room) {
          const userStream = room.users.find(
            (user) => user.socketId === selectedUserId,
          );

          if (!userStream) {
            isStreamSelected = true;
          }
        }
      }

      if (isStreamSelected) {
        handleCloseStream();
      }
    };

    socket.on('producerClosed', onProducerClosed);
    socket.on('producer-closed', onProducerClosed);

    return () => {
      socket.off('producerClosed', onProducerClosed);
      socket.off('producer-closed', onProducerClosed);
    };
  }, [socket, consumers, currentRoom, selectedUserId]);

  return (
    <Box style={stylesStreamView.container()}>
      <Box style={stylesStreamView.box()}>
        {selectedUserId && selectedUserData && (
          <>
            <Stream
              videoRef={videoRef}
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
            <Panel>
              {currentRoom &&
                Object.entries(currentRoom.users).map(
                  ([socketId, { userName, userId, producers }]) => {
                    const isStreaming = !!producers.find(
                      (producer) => producer.source === 'screen-video',
                    );
                    const producerIds = producers.map(
                      (producer) => producer.producerId,
                    );
                    const isSpeaking = calculateIsSpeaking(
                      producerIds,
                      currentVoiceChannelId!,
                    );
                    const isMuted = getIsMuted(userId);
                    const isPreviewActive = previewUserIds.has(socketId);
                    const isCameraEnabled = !!producers.find(
                      (producer) => producer.source === 'camera',
                    );

                    return (
                      <Box
                        key={socketId}
                        style={{
                          flexShrink: 0,
                          width: '120px',
                        }}
                      >
                        <VoiceUserCard
                          socketId={socketId}
                          userName={userName}
                          userId={userId}
                          isStreaming={isStreaming}
                          onOpenStream={handleUserClick}
                          onPreviewStream={handlePreviewStream}
                          isMuted={isMuted}
                          isSpeaking={isSpeaking}
                          isPreviewActive={isPreviewActive}
                          consumers={consumers}
                          userProducerIds={producerIds}
                          isCompact={true}
                          isCameraEnabled={isCameraEnabled}
                        />
                      </Box>
                    );
                  },
                )}
            </Panel>
          </>
        )}
      </Box>
    </Box>
  );
};
