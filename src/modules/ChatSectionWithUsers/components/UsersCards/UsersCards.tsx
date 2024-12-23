import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  ScrollArea,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { ArrowLeftFromLine } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { toggleUserStreamView } from '../../../../store/app/AppSettingsSlice';
import { Room } from '../../../../utils/types';
import { getUserGroups } from '../../utils/getUserGroups';

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
                      onClick={() => onOpenStream(socketId)}
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

export default UsersCards;
