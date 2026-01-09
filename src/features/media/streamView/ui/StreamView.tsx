import { Box } from '@mantine/core';
import { useEffect } from 'react';

import { Panel } from './Panel';
import { Stream } from './Stream';
import { stylesStreamView } from './StreamView.style';

import { socket } from '~/api/socket';
import { useMediaContext } from '~/context';
import { VoiceUserCard } from '~/entities/media';
import { getUserGroups } from '~/helpers';
import { useAppSelector } from '~/hooks';
import { useStream, useSpeaking } from '~/shared/lib/hooks';

export const StreamView = () => {
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

  const { videoRef } = useStream({
    isStreaming: !!selectedUserData,
    consumers,
    userProducerIds: selectedUserData?.producerIds ?? [],
  });

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
            <Stream videoRef={videoRef} />
            <Panel>
              {currentRoom &&
                Object.entries(currentRoom.users).map(
                  ([socketId, { userName, userId, producerIds }]) => {
                    const isStreaming = producerIds.length > 1;
                    const isSpeaking = calculateIsSpeaking(
                      producerIds,
                      currentVoiceChannelId!,
                    );
                    const isMuted = getIsMuted(userId);
                    const isPreviewActive = previewUserIds.has(socketId);

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
