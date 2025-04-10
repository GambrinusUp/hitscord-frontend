import { Avatar, Box, Button, Text } from '@mantine/core';
import { Video } from 'lucide-react';

import { UserItemProps } from './UserItem.types';

export const UserItem = ({
  socketId,
  userName,
  isStreaming,
  handleUserClick,
}: UserItemProps) => {
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
        height: 'auto',
        width: '100px',
      }}
    >
      <Avatar radius="xl" size="sm" style={{ flexShrink: 0 }}>
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
          style={{ flexShrink: 0 }}
        >
          <Video />
        </Button>
      )}
    </Box>
  );
};
