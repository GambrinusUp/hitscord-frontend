import {
  Badge,
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
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useNotification } from '../../../../hooks/useNotification';
import {
  changeRole,
  getServerData,
} from '../../../../store/server/ServerActionCreators';

const ServerSettingsModal: React.FC<{
  opened: boolean;
  onClose: () => void;
}> = ({ opened, onClose }) => {
  const dispatch = useAppDispatch();
  const { serverData, error } = useAppSelector(
    (state) => state.testServerStore
  );
  const { accessToken } = useAppSelector((state) => state.userStore);
  const [activeSetting, setActiveSetting] = useState<'roles'>('roles');
  const [newRoleName, setNewRoleName] = useState('');
  const [assignRoleUserId, setAssignRoleUserId] = useState('');
  const [assignRoleId, setAssignRoleId] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const createRole = async () => {
    if (!newRoleName) return;
    setLoading(true);
    try {
      console.log(newRoleName);
      setNewRoleName('');
    } catch (error) {
      console.error('Failed to create role:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!assignRoleUserId || !assignRoleId) return;
    setLoading(true);
    const result = await dispatch(
      changeRole({
        accessToken,
        serverId: serverData.serverId,
        userId: assignRoleUserId,
        role: assignRoleId,
      })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      setAssignRoleUserId('');
      setAssignRoleId('');
      setLoading(false);
      showSuccess('Роль успешно присвоена');
      dispatch(getServerData({ accessToken, serverId: serverData.serverId }));
    }
  };

  useEffect(() => {
    if (error) {
      setLoading(false);
      showError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        </Stack>
        <ScrollArea>
          {activeSetting === 'roles' && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Роли
              </Text>
              <Stack gap="xs">
                {serverData.roles.map((role) => (
                  <Badge color="blue" key={role.id}>
                    {role.name}
                  </Badge>
                ))}
              </Stack>
              <TextInput
                label="Создать новую роль"
                placeholder="Названии роли"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.currentTarget.value)}
              />
              <Button
                onClick={createRole}
                loading={loading}
                leftSection={<Plus size={16} />}
              >
                Добавить роль
              </Button>
              <Text size="lg" w={500}>
                Присвоить роль пользователю
              </Text>
              <TextInput
                label="User ID"
                placeholder="Введите User ID"
                value={assignRoleUserId}
                onChange={(e) => setAssignRoleUserId(e.currentTarget.value)}
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
        </ScrollArea>
      </Group>
    </Modal>
  );
};

export default ServerSettingsModal;
