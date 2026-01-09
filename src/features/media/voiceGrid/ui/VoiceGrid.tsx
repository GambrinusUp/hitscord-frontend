import { ActionIcon, Group, ScrollArea, SimpleGrid } from '@mantine/core';
import { ArrowLeftFromLine } from 'lucide-react';

import { useMediaContext } from '~/context';
import { VoiceUserCard } from '~/entities/media';
import { getUserGroups } from '~/helpers';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useSpeaking } from '~/shared/lib/hooks';
import { toggleUserStreamView } from '~/store/AppStore';

export const VoiceGrid = () => {
  const dispatch = useAppDispatch();
  const { users, setSelectedUserId, previewUserIds, togglePreview, consumers } =
    useMediaContext();
  const { calculateIsSpeaking, getIsMuted } = useSpeaking();
  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );

  const rooms = getUserGroups(users);
  const currentRoom = rooms.find(
    (room) => room.roomName === currentVoiceChannelId,
  );

  const handleOpenStream = (socketId: string) => {
    setSelectedUserId(socketId);
  };

  const handlePreviewStream = (socketId: string) => {
    togglePreview(socketId);
  };

  const handleBack = () => {
    dispatch(toggleUserStreamView());
  };

  return (
    <ScrollArea style={{ flex: 1, maxHeight: '100%' }}>
      <Group justify="flex-end">
        <ActionIcon variant="transparent" onClick={handleBack}>
          <ArrowLeftFromLine />
        </ActionIcon>
      </Group>
      <SimpleGrid cols={{ base: 2, lg: 3 }} spacing="sm">
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
                <VoiceUserCard
                  key={socketId}
                  socketId={socketId}
                  userName={userName}
                  userId={userId}
                  isStreaming={isStreaming}
                  onOpenStream={handleOpenStream}
                  onPreviewStream={handlePreviewStream}
                  isMuted={isMuted}
                  isSpeaking={isSpeaking}
                  isPreviewActive={isPreviewActive}
                  consumers={consumers}
                  userProducerIds={producerIds}
                />
              );
            },
          )}
      </SimpleGrid>
    </ScrollArea>
  );
};
