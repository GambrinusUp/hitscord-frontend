import { Avatar, Box, Stack, Text, Title } from '@mantine/core';

import { useAppSelector } from '../../../hooks/redux';

const ProfileSideBar = () => {
  const { user } = useAppSelector((state) => state.userStore);
  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={{ base: 300 }}
      visibleFrom="sm"
    >
      <Stack gap="md" align="center" style={{ whiteSpace: 'nowrap' }}>
        <Avatar size={80} radius="xl" src={undefined} alt={user.name} />
        <Title order={3}>{user.name}</Title>
        <Text c="gray">ID: {user.tag}</Text>
        <Text c="gray">E-mail: {user.mail}</Text>
        <Text c="gray">Аккаунт создан: {user.accontCreateDate}</Text>
      </Stack>
    </Box>
  );
};

export default ProfileSideBar;
