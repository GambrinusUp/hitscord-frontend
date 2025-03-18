import { ActionIcon, Group, ScrollArea, SimpleGrid } from '@mantine/core';
import { ArrowLeftFromLine } from 'lucide-react';

import { UserCardsProps } from './UsersCards.types';

import { getUserGroups } from '~/helpers';
import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import { UserCard } from '~/modules/ChatSectionWithUsers/components/UserCard';
import { toggleUserStreamView } from '~/store/AppStore';

export const UsersCards = ({ users, onOpenStream }: UserCardsProps) => {
  const dispatch = useAppDispatch();

  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );

  const rooms = getUserGroups(users);
  const currentRoom = rooms.find(
    (room) => room.roomName === currentVoiceChannelId,
  );

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
        {currentRoom &&
          Object.entries(currentRoom.users).map(
            ([socketId, { userName, producerIds }]) => {
              const isStreaming = producerIds.length > 1;

              return (
                <UserCard
                  key={socketId}
                  socketId={socketId}
                  userName={userName}
                  isStreaming={isStreaming}
                  onOpenStream={onOpenStream}
                />
              );
            },
          )}
      </SimpleGrid>
    </ScrollArea>
  );
};
