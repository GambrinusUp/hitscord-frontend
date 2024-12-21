import { Avatar, Box, Text } from '@mantine/core';

interface ThreadItemProps {
  name: string;
  lastMessage: string;
  date: string;
  isActive: boolean;
  onClick: () => void;
}

const ThreadItem = ({
  name,
  lastMessage,
  date,
  isActive,
  onClick,
}: ThreadItemProps) => {
  return (
    <Box
      p="sm"
      bg={isActive ? '#2E2E33' : 'transparent'}
      style={(theme) => ({
        borderRadius: theme.radius.sm,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      })}
      onClick={onClick}
    >
      <Avatar radius="xl" size={40} />
      <Box style={{ flex: 1 }}>
        <Text fw="bold">{name}</Text>
        <Text size="sm" c="gray" truncate>
          {lastMessage}
        </Text>
        <Text size="xs" c="gray">
          {date}
        </Text>
      </Box>
    </Box>
  );
};

export default ThreadItem;
