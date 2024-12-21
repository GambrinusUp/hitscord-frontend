import { Avatar, Badge, Box, Divider, Group, Stack, Text } from '@mantine/core';

import { useAppSelector } from '../../hooks/redux';

const DetailsPanel = () => {
  const { serverData } = useAppSelector((state) => state.testServerStore);
  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={{ base: 200, lg: 300 }}
      visibleFrom="sm"
    >
      <Stack gap="md">
        <Text c="white">Пользователи</Text>
        <Divider color="gray" />
        <Stack>
          {serverData.users.map((user) => (
            <Group key={user.userId} wrap="nowrap">
              <Avatar size="md" color="blue">
                {user.userName}
              </Avatar>
              <Text c="white">{user.userName}</Text>
              <Badge color="green" radius="sm" style={{ marginLeft: 'auto' }}>
                {user.roleName}
              </Badge>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default DetailsPanel;
