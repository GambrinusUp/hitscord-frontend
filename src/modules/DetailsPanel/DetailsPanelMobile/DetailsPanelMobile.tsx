import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';

import { useAppSelector } from '../../../hooks/redux';

interface DetailsPanelMobileProps {
  onClose: () => void;
  opened: boolean;
}

const DetailsPanelMobile = ({ onClose, opened }: DetailsPanelMobileProps) => {
  const { serverData, isLoading } = useAppSelector(
    (state) => state.testServerStore
  );

  return (
    <>
      <Drawer
        opened={opened}
        onClose={onClose}
        size="xs"
        position="right"
        styles={{
          content: {
            backgroundColor: '#1A1B1E',
            color: '#ffffff',
          },
          header: {
            backgroundColor: '#1A1B1E',
          },
          body: {
            height: 'calc(100dvh - 60px)',
          },
        }}
      >
        <Box style={{ padding: '10px', backgroundColor: '#1A1B1E' }}>
          <Stack gap="md">
            <Text c="white">Пользователи</Text>
            <Divider color="gray" />
            <Stack>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <Group key={index} gap="sm" align="center">
                      <Skeleton circle height={40} width={40} />
                      <Skeleton height={16} width="30%" />
                      <Skeleton
                        height={16}
                        width="20%"
                        style={{ marginLeft: 'auto' }}
                      />
                    </Group>
                  ))
                : serverData.users.map((user) => (
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
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default DetailsPanelMobile;
