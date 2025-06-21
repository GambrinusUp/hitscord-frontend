import {
  Button,
  Group,
  Modal,
  NavLink,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { Plus, UserMinus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ServerSettingsModalProps } from './ServerSettingsModal.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import {
  changeRole,
  changeServerName,
  deleteUserFromServer,
  getBannedUsers,
  getServerData,
} from '~/store/ServerStore';

export const ServerSettingsModal = ({
  opened,
  onClose,
}: ServerSettingsModalProps) => {
  const dispatch = useAppDispatch();
  const { serverData, currentServerId, error } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const [activeSetting, setActiveSetting] = useState<
    'name' | 'roles' | 'deleteUser'
  >('roles');
  const [assignRoleUserId, setAssignRoleUserId] = useState<string | null>('');
  const [assignRoleId, setAssignRoleId] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const [newServerName, setNewServerName] = useState(serverData.serverName);
  const { showSuccess } = useNotification();
  const [deletedUserId, setDeletedUserId] = useState<string | null>('');
  const isCreator = serverData.isCreator;
  const canDeleteUsers = serverData.permissions.canDeleteUsers;

  const assignRole = async () => {
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

  const handleChangeServerName = async () => {
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
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Пользователь успешно удалён');
        setDeletedUserId(null);
        onClose();
      }
    }
  };

  useEffect(() => {
    if (canDeleteUsers && accessToken && currentServerId) {
      dispatch(getBannedUsers({ accessToken, serverId: currentServerId }));
    }
  }, [canDeleteUsers, currentServerId]);

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
          <NavLink
            label="Роли"
            leftSection={<Plus size={16} />}
            active={activeSetting === 'roles'}
            onClick={() => setActiveSetting('roles')}
          />
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
        </Stack>
        <ScrollArea>
          {activeSetting === 'roles' && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Присвоить роль пользователю
              </Text>
              <Select
                label="Выбор пользователя"
                placeholder="Выберите пользователя"
                data={serverData.users
                  .filter((userOnServer) => userOnServer.userId !== user.id)
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
                data={serverData.roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
                value={assignRoleId}
                onChange={setAssignRoleId}
              />
              <Button onClick={assignRole} loading={loading}>
                Присвоить роль
              </Button>
            </Stack>
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
                  .map((userOnServer) => ({
                    value: userOnServer.userId,
                    label: userOnServer.userName,
                  }))}
                value={deletedUserId}
                onChange={setDeletedUserId}
              />
              <Button onClick={handleDeleteUser} loading={loading}>
                Удалить
              </Button>
            </Stack>
          )}
        </ScrollArea>
      </Group>
    </Modal>
  );
};
