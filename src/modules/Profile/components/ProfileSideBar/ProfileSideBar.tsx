import { Avatar, Box, Stack, Text, Title, Tooltip } from '@mantine/core';

import { useAppSelector } from '~/hooks';

export const ProfileSideBar = () => {
  const { user } = useAppSelector((state) => state.userStore);

  return (
    <Box
      style={{ padding: '10px', backgroundColor: '#1A1B1E' }}
      w={{ base: 300 }}
      visibleFrom="sm"
    >
      <Stack gap="md" align="center">
        <Avatar size={80} radius="xl" src={undefined} alt={user.name} />
        <Tooltip label={user.name} withArrow>
          <Title
            order={3}
            style={{
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {user.name}
          </Title>
        </Tooltip>
        <Tooltip label={user.tag} withArrow>
          <Text
            c="gray"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              display: 'block',
            }}
          >
            ID: {user.tag}
          </Text>
        </Tooltip>
        <Tooltip label={user.mail} withArrow>
          <Text
            c="gray"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              display: 'block',
            }}
          >
            E-mail: {user.mail}
          </Text>
        </Tooltip>
        <Text c="gray">Аккаунт создан: {user.accontCreateDate}</Text>
      </Stack>
    </Box>
  );
};
