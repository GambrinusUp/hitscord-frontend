import { Avatar, Box, Button, Text } from '@mantine/core';

import { UserCardProps } from './UserCard.types';

export const UserCard = ({
  socketId,
  userName,
  isStreaming,
  onOpenStream,
}: UserCardProps) => {
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
};
