import { Avatar, Badge, Box, Divider, Group, Stack, Text } from '@mantine/core';

const users = [
  {
    id: 1,
    name: 'Alice',
    online: true,
  },
  { id: 2, name: 'Bob', online: false },
  {
    id: 3,
    name: 'Charlie',
    online: true,
  },
];

const DetailsPanel = () => {
  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={{ base: 200, lg: 300 }}
      visibleFrom="sm"
    >
      <Stack gap="md">
        <Text c="white">Пользователи</Text>
        <Divider color="gray" />
        <Text c="gray">В сети</Text>
        <Stack>
          {users
            .filter((user) => user.online)
            .map((user) => (
              <Group key={user.id} wrap="nowrap">
                <Avatar size="md" color="blue">
                  {user.name[0]}
                </Avatar>
                <Text c="white">{user.name}</Text>
                <Badge color="green" radius="sm" style={{ marginLeft: 'auto' }}>
                  В сети
                </Badge>
              </Group>
            ))}
        </Stack>
        <Divider color="gray" />
        <Text c="gray">Не в сети</Text>
        <Stack>
          {users
            .filter((user) => !user.online)
            .map((user) => (
              <Group key={user.id} wrap="nowrap">
                <Avatar size="md" color="blue">
                  {user.name[0]}
                </Avatar>
                <Text c="dimmed">{user.name}</Text>
                <Badge color="gray" radius="sm" style={{ marginLeft: 'auto' }}>
                  Не в сети
                </Badge>
              </Group>
            ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default DetailsPanel;
