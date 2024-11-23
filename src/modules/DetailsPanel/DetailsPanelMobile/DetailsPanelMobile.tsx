import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from '@mantine/core';

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

interface DetailsPanelMobileProps {
  onClose: () => void;
  opened: boolean;
}

const DetailsPanelMobile = ({ onClose, opened }: DetailsPanelMobileProps) => {
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
                    <Badge
                      color="green"
                      radius="sm"
                      style={{ marginLeft: 'auto' }}
                    >
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
                    <Badge
                      color="gray"
                      radius="sm"
                      style={{ marginLeft: 'auto' }}
                    >
                      Не в сети
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
