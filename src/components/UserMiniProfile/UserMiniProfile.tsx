import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  CopyButton,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { Check, Copy, UserPlus } from 'lucide-react';

import { stylesUserMiniProfile } from './UserMiniProfile.style';

import { createApplication } from '~/entities/friendship';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { UserOnServer } from '~/store/ServerStore';

interface UserMiniProfileProps {
  userOnServer: UserOnServer;
}

export const UserMiniProfile = ({ userOnServer }: UserMiniProfileProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  //const { roles } = useAppSelector((state) => state.testServerStore.serverData);
  const { applicationFrom } = useAppSelector((state) => state.friendshipStore);
  const { user } = useAppSelector((state) => state.userStore);

  const { userName, userTag, userId, notifiable, nonFriendMessage } =
    userOnServer;
  const userRoles = userOnServer.roles;

  const application = applicationFrom.find((app) => app.user.userId === userId);

  /*const badgeColor =
    roles.find((role) => role.name === roleName)?.color ?? 'green';*/

  const handleAddFriend = async () => {
    const result = await dispatch(
      createApplication({
        userTag,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Запрос на дружбу отправлен');
    }
  };

  return (
    <Stack gap="xs" justify="center" align="center" w="100%">
      <Avatar size="lg" color="blue">
        {userName[0]}
      </Avatar>
      <Text c="white" style={stylesUserMiniProfile.userName()}>
        {userName}
      </Text>
      <Group>
        <Text c="dimmed" style={stylesUserMiniProfile.userTag()}>
          {userTag}
        </Text>
        <CopyButton value={userTag} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? 'Скопировано' : 'Скопировать'}
              withArrow
              position="right"
            >
              <ActionIcon
                color={copied ? 'teal' : 'gray'}
                variant="subtle"
                onClick={copy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
      <Group gap="sm">
        {userRoles.map((role) => (
          <Badge
            key={role.roleId}
            //color={badgeColor}
            radius="md"
            variant="light"
            style={stylesUserMiniProfile.roleName()}
          >
            {role.roleName}
          </Badge>
        ))}
      </Group>
      {user.id !== userId && (
        <Button
          leftSection={<UserPlus />}
          variant="light"
          radius="md"
          onClick={handleAddFriend}
          disabled={application ? true : false}
        >
          {application ? 'Заявка отправлена' : 'Добавить в друзья'}
        </Button>
      )}
      <Divider color="dimmed" w="100%" />
      <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
        <Stack gap={0} align="center" justify="center">
          <Text c="dimmed">Уведомления</Text>
          <Text fw={700}>{notifiable ? 'Включены' : 'Отключены'}</Text>
        </Stack>
        <Stack gap={0} align="center" justify="center">
          <Text c="dimmed">Сообщения</Text>
          <Text fw={700}>{nonFriendMessage ? 'Включены' : 'Отключены'}</Text>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
};
