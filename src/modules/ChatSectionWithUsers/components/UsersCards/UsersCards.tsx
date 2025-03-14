import { ActionIcon, Group, ScrollArea, SimpleGrid } from '@mantine/core';
import { ArrowLeftFromLine } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { toggleUserStreamView } from '../../../../store/app/AppSettingsSlice';
import { Room } from '../../../../utils/types';
import { getUserGroups } from '../../utils/getUserGroups';
import { UserCard } from '../UserCard';

interface UserCardsProps {
  users: Room[];
  onOpenStream: (socketId: string) => void;
}

const UsersCards = ({ users, onOpenStream }: UserCardsProps) => {
  const dispatch = useAppDispatch();

  const { currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore
  );

  const rooms = getUserGroups(users);
  const currentRoom = rooms.find(
    (room) => room.roomName === currentVoiceChannelId
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
                  socketId={socketId}
                  userName={userName}
                  isStreaming={isStreaming}
                  onOpenStream={onOpenStream}
                />
              );
            }
          )}
      </SimpleGrid>
    </ScrollArea>
  );
};

export default UsersCards;
