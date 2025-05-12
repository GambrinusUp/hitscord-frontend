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
import { Pencil, Trash2, UserRoundCog, UserRoundPen } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SettingsChannelModalProps } from './SettingsChannelModal.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import {
  changeChannelName,
  deleteChannel,
  getChannelSettings,
} from '~/store/ServerStore';

export const SettingsChannelModal = ({
  opened,
  onClose,
  channelId,
  channelName,
}: SettingsChannelModalProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const [activeSetting, setActiveSetting] = useState<
    'name' | 'delete' | 'watchSettings' | 'settings'
  >('name');
  const [newChannelName, setNewChannelName] = useState(channelName);
  const [loading, setLoading] = useState(false);
  const { showSuccess } = useNotification();
  const [add, setAdd] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [assignRoleId, setAssignRoleId] = useState<string | null>('');

  const handleChangeChannelName = async () => {
    setLoading(true);
    const result = await dispatch(
      changeChannelName({
        accessToken,
        id: channelId,
        name: newChannelName,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      showSuccess('Название канала успешно изменилось');
      onClose();
    }
  };

  const handleDeleteChannel = async () => {
    setLoading(true);
    const result = await dispatch(
      deleteChannel({
        accessToken,
        channelId,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      setLoading(false);
      showSuccess('Канал успешно удалён');
      onClose();
    }
  };

  const handleChangeChannelSettings = () => {
    console.log(add, type);
  };

  useEffect(() => {
    if (accessToken) {
      dispatch(getChannelSettings({ accessToken, channelId }));
    }
  }, [accessToken]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Настройки канала"
      size="auto"
    >
      <Group align="flex-start" gap="md">
        <Stack gap="xs" style={{ width: 200 }}>
          <NavLink
            label="Название"
            leftSection={<Pencil size={16} />}
            active={activeSetting === 'name'}
            onClick={() => setActiveSetting('name')}
          />
          <NavLink
            label="Удаление"
            leftSection={<Trash2 size={16} />}
            active={activeSetting === 'delete'}
            onClick={() => setActiveSetting('delete')}
          />
          <NavLink
            label="Роли"
            leftSection={<UserRoundCog size={16} />}
            active={activeSetting === 'watchSettings'}
            onClick={() => setActiveSetting('watchSettings')}
          />
          <NavLink
            label="Настройки"
            leftSection={<UserRoundPen size={16} />}
            active={activeSetting === 'settings'}
            onClick={() => setActiveSetting('settings')}
          />
        </Stack>
        <ScrollArea>
          {activeSetting === 'name' && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Изменить название канала
              </Text>
              <TextInput
                label="Новое название канала"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder={channelName}
              />
              <Button onClick={handleChangeChannelName} loading={loading}>
                Изменить название
              </Button>
            </Stack>
          )}
          {activeSetting === 'delete' && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Удаление канала
              </Text>
              <Button
                color="red"
                onClick={handleDeleteChannel}
                loading={loading}
              >
                Удалить канал
              </Button>
            </Stack>
          )}
          {activeSetting === 'watchSettings' && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Просмотр ролей
              </Text>
              <Text>Могу читать:</Text>
              <Text>Могу писать:</Text>
            </Stack>
          )}
          {activeSetting === 'settings' && (
            <Stack gap="md">
              <Text size="lg" w={500}>
                Смена настроек для ролей
              </Text>
              <Group align="center">
                <Select
                  label="Действие"
                  placeholder="Выберите действие"
                  data={[
                    { value: 'true', label: 'Разрешить' },
                    { value: 'false', label: 'Запретить' },
                  ]}
                  value={add}
                  onChange={setAdd}
                />
                <Select
                  label="Возможность"
                  placeholder="Выберите возможность"
                  data={[
                    { value: '0', label: 'Читать' },
                    { value: '1', label: 'Писать' },
                  ]}
                  value={type}
                  onChange={setType}
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
              </Group>
              <Button onClick={handleChangeChannelSettings} loading={loading}>
                Изменить настройки
              </Button>
            </Stack>
          )}
        </ScrollArea>
      </Group>
    </Modal>
  );
};
