import {
  Avatar,
  Badge,
  Box,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';

import { useAppSelector } from '../../hooks/redux';

const DetailsPanel = () => {
  const { serverData } = useAppSelector((state) => state.testServerStore);

  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={300}
      h="100%"
      visibleFrom="sm"
    >
      <Stack gap="md" h="100%">
        <Text c="white">Пользователи</Text>
        <Divider color="gray" />
        <ScrollArea.Autosize mah="100%" maw="100%">
          <Stack gap="xs">
            {serverData.users.map((user) => (
              <Group key={user.userId} wrap="nowrap">
                <Avatar size="md" color="blue">
                  {user.userName}
                </Avatar>
                <Text c="white">{user.userName}</Text>
                <Badge
                  fullWidth
                  color="green"
                  radius="sm"
                  style={{ marginLeft: 'auto', maxWidth: 100 }}
                >
                  {user.roleName}
                </Badge>
              </Group>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Box>
  );
};

export default DetailsPanel;
