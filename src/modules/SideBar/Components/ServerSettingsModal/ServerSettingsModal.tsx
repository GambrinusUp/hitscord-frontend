import {
  Button,
  Group,
  Modal,
  NavLink,
  ScrollArea,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ServerSettingsModalProps } from './ServerSettingsModal.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeRole, getServerData } from '~/store/ServerStore';

export const ServerSettingsModal = ({
  opened,
  onClose,
}: ServerSettingsModalProps) => {
  const dispatch = useAppDispatch();
  const { serverData, error } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const [activeSetting, setActiveSetting] = useState<'roles'>('roles');
  const [assignRoleUserId, setAssignRoleUserId] = useState<string | null>('');
  const [assignRoleId, setAssignRoleId] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

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

  useEffect(() => {
    if (error) {
      setLoading(false);
      showError(error);
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
        </ScrollArea>
      </Group>
    </Modal>
  );
};
