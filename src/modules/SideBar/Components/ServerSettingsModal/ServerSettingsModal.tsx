import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Modal,
  NavLink,
  Pagination,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { Calendar, Plus, UserCheck, UserMinus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ServerSettingsModalProps } from './ServerSettingsModal.types';
import { UserRoleItem } from './UserRoleItem';

import { formatDateTime } from '~/helpers';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { LoadingState } from '~/shared';
import { getRoles } from '~/store/RolesStore';
import {
  changeServerName,
  deleteUserFromServer,
  getBannedUsers,
  unbanUser,
} from '~/store/ServerStore';

export const ServerSettingsModal = ({
  opened,
  onClose,
}: ServerSettingsModalProps) => {
  const dispatch = useAppDispatch();
  const {
    serverData,
    currentServerId,
    error,
    bannedUsers,
    pageBannedUsers,
    totalPagesBannedUsers,
  } = useAppSelector((state) => state.testServerStore);
  const { rolesLoading } = useAppSelector((state) => state.rolesStore);
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const [activeSetting, setActiveSetting] = useState<
    'name' | 'roles' | 'deleteUser' | 'unbanUser'
  >('roles');
  //const [assignRoleUserId, setAssignRoleUserId] = useState<string | null>('');
  //const [assignRoleId, setAssignRoleId] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const [newServerName, setNewServerName] = useState(serverData.serverName);
  const { showSuccess } = useNotification();
  const [deletedUserId, setDeletedUserId] = useState<string | null>('');
  const [banReason, setBanReason] = useState<string>('');
  const isCreator = serverData.isCreator;
  const canDeleteUsers = serverData.permissions.canDeleteUsers;
  const canChangeRole = serverData.permissions.canChangeRole;
  const canCreateRoles = serverData.permissions.canCreateRoles;
  const users = serverData.users;

  /*const assignRole = async () => {
    if (!assignRoleUserId || !assignRoleId) return;
    setLoading(true);
    const result = await dispatch(
      changeRole({
        accessToken,
        serverId: serverData.serverId,
        userId: assignRoleUserId,
        role: assignRoleId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      showSuccess('Роль успешно присвоена');
      dispatch(getServerData({ accessToken, serverId: serverData.serverId }));
      onClose();
    }
  };
*/
  const handleChangeServerName = async () => {
    if (newServerName.length < 6) {
      return;
    }

    if (currentServerId) {
      setLoading(true);

      const result = await dispatch(
        changeServerName({
          accessToken,
          serverId: currentServerId,
          name: newServerName,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Название успешно изменено');
        onClose();
      }
    }
  };

  const handleDeleteUser = async () => {
    if (currentServerId && deletedUserId) {
      setLoading(true);

      const result = await dispatch(
        deleteUserFromServer({
          accessToken,
          serverId: currentServerId,
          userId: deletedUserId,
          banReason: banReason.trim() !== '' ? banReason : undefined,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Пользователь успешно удалён');
        setDeletedUserId(null);
        setBanReason('');
        onClose();
      }
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (currentServerId) {
      setLoading(true);

      const result = await dispatch(
        unbanUser({
          accessToken,
          serverId: currentServerId,
          userId: userId,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Пользователь успешно разблокирован');
        onClose();
      }
    }
  };

  const handleChangePage = () => {
    if (pageBannedUsers < totalPagesBannedUsers && currentServerId) {
      dispatch(
        getBannedUsers({
          accessToken,
          serverId: currentServerId,
          page: pageBannedUsers + 1,
          size: 5,
        }),
      );
    }
  };

  useEffect(() => {
    if (canDeleteUsers && accessToken && currentServerId && opened) {
      dispatch(
        getBannedUsers({
          accessToken,
          serverId: currentServerId,
          page: 1,
          size: 5,
        }),
      );
    }
  }, [canDeleteUsers, currentServerId, opened]);

  useEffect(() => {
    if (
      canCreateRoles &&
      rolesLoading === LoadingState.IDLE &&
      currentServerId
    ) {
      console.log(canCreateRoles);
      dispatch(getRoles({ accessToken, serverId: currentServerId }));
    }
  }, [rolesLoading, currentServerId]);

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Настройки сервера"
      size="auto"
    >
      <Group align="flex-start" gap="md">
        <Stack gap="xs" style={{ width: 200 }}>
          {canChangeRole && (
            <NavLink
              label="Роли"
              leftSection={<Plus size={16} />}
              active={activeSetting === 'roles'}
              onClick={() => setActiveSetting('roles')}
            />
          )}
          {isCreator && (
            <NavLink
              label="Название сервера"
              leftSection={<Plus size={16} />}
              active={activeSetting === 'name'}
              onClick={() => setActiveSetting('name')}
            />
          )}
          {(isCreator || canDeleteUsers) && (
            <NavLink
              label="Удаление пользователя"
              leftSection={<UserMinus size={16} />}
              active={activeSetting === 'deleteUser'}
              onClick={() => setActiveSetting('deleteUser')}
            />
          )}
          {canDeleteUsers && (
            <NavLink
              label="Разблокирование пользователя"
              leftSection={<UserCheck size={16} />}
              active={activeSetting === 'unbanUser'}
              onClick={() => setActiveSetting('unbanUser')}
            />
          )}
        </Stack>
        <ScrollArea>
          {/*activeSetting === 'roles' && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Присвоить роль пользователю
              </Text>
              <Select
                label="Выбор пользователя"
                placeholder="Выберите пользователя"
                data={serverData.users
                  .filter((userOnServer) => userOnServer.userId !== user.id)
                  .filter(
                    (userOnServer) =>
                      userOnServer.roleType !== RoleType.Creator,
                  )
                  .filter(
                    (userOnServer) =>
                      Number(userOnServer.roleType) >=
                      Number(serverData.userRoleType),
                  )
                  .map((userOnServer) => ({
                    value: userOnServer.userId,
                    label: userOnServer.userName,
                  }))}
                value={assignRoleUserId}
                onChange={setAssignRoleUserId}
              />
              <Select
                label="Выбор роли"
                placeholder="Выберите роль"
                data={rolesList
                  .filter(
                    (role) =>
                      Number(role.role.type) >= Number(serverData.userRoleType),
                  )
                  .map((role) => ({
                    value: role.role.id,
                    label: role.role.name,
                  }))}
                value={assignRoleId}
                onChange={setAssignRoleId}
              />
              <Button onClick={assignRole} loading={loading}>
                Присвоить роль
              </Button>
            </Stack>
          )*/}
          {activeSetting === 'roles' && (
            <ScrollArea.Autosize mah={400} miw={500} mx="auto">
              <Stack gap="md">
                {users.map((user) => (
                  <UserRoleItem key={user.userId} user={user} />
                ))}
              </Stack>
            </ScrollArea.Autosize>
          )}
          {activeSetting === 'name' && isCreator && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Изменить название сервера
              </Text>
              <TextInput
                label="Новое название сервера"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                placeholder={serverData.serverName}
                description="от 6 до 50 символов"
                maxLength={50}
              />
              <Button onClick={handleChangeServerName} loading={loading}>
                Изменить название
              </Button>
            </Stack>
          )}
          {activeSetting === 'deleteUser' && (isCreator || canDeleteUsers) && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Удалить пользователя с сервера
              </Text>
              <Select
                label="Выбор пользователя"
                placeholder="Выберите пользователя"
                data={serverData.users
                  .filter((userOnServer) => userOnServer.userId !== user.id)
                  /*.filter(
                    (userOnServer) =>
                      userOnServer.roleType !== RoleType.Creator,
                  )*/
                  /*.filter(
                    (userOnServer) =>
                      Number(userOnServer.roleType) >=
                      Number(serverData.userRoleType),
                  )*/
                  .map((userOnServer) => ({
                    value: userOnServer.userId,
                    label: userOnServer.userName,
                  }))}
                value={deletedUserId}
                onChange={setDeletedUserId}
              />
              <TextInput
                label="Введите причину бана (необязательно)"
                placeholder="Причина бана"
                value={banReason}
                onChange={(event) => setBanReason(event.currentTarget.value)}
              />
              <Button onClick={handleDeleteUser} loading={loading}>
                Удалить
              </Button>
            </Stack>
          )}
          {activeSetting === 'unbanUser' && canDeleteUsers && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Разблокировать пользователя
              </Text>
              {bannedUsers.length < 1 && (
                <Text>Нет заблокированных пользователей</Text>
              )}
              {bannedUsers &&
                bannedUsers.map((user) => (
                  <Card key={user.userId} withBorder>
                    <Group gap="md">
                      <Grid>
                        <Grid.Col span={2}>
                          <Group>
                            <Avatar radius="xl" size="lg" color="blue">
                              {user.userName[0]}
                            </Avatar>
                            <Stack gap={0}>
                              <Text>{user.userName}</Text>
                              <Text c="dimmed">{user.userTag}</Text>
                            </Stack>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={8}>
                          {user.banReason && (
                            <Badge
                              style={{
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                              }}
                            >
                              {user.banReason}
                            </Badge>
                          )}
                        </Grid.Col>
                        <Grid.Col span={1}>
                          <Group>
                            <Calendar />
                            <Text>{formatDateTime(user.banTime)}</Text>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={1}>
                          <Button
                            variant="light"
                            onClick={() => handleUnbanUser(user.userId)}
                            loading={loading}
                            disabled={loading}
                          >
                            Разблокировать
                          </Button>
                        </Grid.Col>
                      </Grid>
                    </Group>
                  </Card>
                ))}
              <Flex w="100%" justify="center">
                {bannedUsers.length > 0 && (
                  <Pagination
                    total={totalPagesBannedUsers}
                    value={pageBannedUsers}
                    onChange={handleChangePage}
                  />
                )}
              </Flex>
            </Stack>
          )}
        </ScrollArea>
      </Group>
    </Modal>
  );
};
