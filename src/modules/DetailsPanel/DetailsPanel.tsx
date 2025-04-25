import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';

import { useAppSelector } from '~/hooks';

export const DetailsPanel = () => {
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
              <Flex key={user.userId} align="center" gap="sm" style={{ width: '100%', overflow: 'hidden' }}>
                <Avatar size="md" color="blue">
                  {user.userName}
                </Avatar>
                <Tooltip label={user.userName} position="top-start" withArrow>
                  <Text c="white" style={{ flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', lineHeight: '1.2em', maxHeight: '2.4em', wordBreak: 'break-word', cursor: 'default' }}>
                    {user.userName}
                  </Text>
                </Tooltip>
                <Tooltip label={user.roleName} position="top-end" withArrow>
                  <Badge color="green" radius="sm" style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'default' }}>
                    {user.roleName}
                  </Badge>
                </Tooltip>
              </Flex>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Box>
  );
};
