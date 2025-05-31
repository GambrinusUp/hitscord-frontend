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
import { Pencil, Trash2, UserRoundCog, UserRoundPen } from 'lucide-react';
import { useEffect, useState } from 'react';

import './SettingsChannelModal.style.css';
import { SettingsChannelModalProps } from './SettingsChannelModal.types';
import {
  getOptionsForChannelType,
  toBoolean,
} from './SettingsChannelModal.utils';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import {
  changeChannelName,
  changeTextChannelSettings,
  changeVoiceChannelSettings,
  ChannelType,
  deleteChannel,
  getChannelSettings,
} from '~/store/ServerStore';

export const SettingsChannelModal = ({
  opened,
  onClose,
  channelId,
  channelName,
  channelType,
}: SettingsChannelModalProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { serverData, roleSettings } = useAppSelector(
    (state) => state.testServerStore,
  );
  const [activeSetting, setActiveSetting] = useState<
    'name' | 'delete' | 'watchSettings' | 'settings'
  >('name');
  const [newChannelName, setNewChannelName] = useState(channelName);
  const [loading, setLoading] = useState(false);
  const { showSuccess } = useNotification();
  const [add, setAdd] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [assignRoleId, setAssignRoleId] = useState<string | null>('');

  const canSee = roleSettings.canSee;
  const canJoin = roleSettings.canJoin;
  const canWrite = roleSettings.canWrite;
  const canWriteSub = roleSettings.canWriteSub;
  //const canUse = roleSettings.canUse;
  //const notificated = roleSettings.notificated;

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

  const handleChangeChannelSettings = async () => {
    setLoading(true);

    if (
      channelType === ChannelType.TEXT_CHANNEL &&
      add &&
      type &&
      assignRoleId
    ) {
      const result = await dispatch(
        changeTextChannelSettings({
          accessToken,
          settings: {
            channelId,
            add: toBoolean(add),
            type: Number(type),
            roleId: assignRoleId,
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Настройки успешно изменены');
        onClose();
      }
    }

    if (
      channelType === ChannelType.VOICE_CHANNEL &&
      add &&
      type &&
      assignRoleId
    ) {
      const result = await dispatch(
        changeVoiceChannelSettings({
          accessToken,
          settings: {
            channelId,
            add: toBoolean(add),
            type: Number(type),
            roleId: assignRoleId,
          },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        setLoading(false);
        showSuccess('Настройки успешно изменены');
        onClose();
      }
    }
  };

  useEffect(() => {
    if (accessToken && opened) {
      dispatch(getChannelSettings({ accessToken, channelId }));
    }
  }, [accessToken, opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Настройки канала"
      size="auto"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
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
              {canSee && (
                <>
                  <Text>Могут читать:</Text>
                  <Stack gap="xs">
                    {canSee.map((role) => (
                      <Badge
                        key={role.id}
                        color={role.color}
                        size="lg"
                        variant="light"
                        radius="md"
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </Stack>
                </>
              )}
              {canJoin && (
                <>
                  <Text>Могут присоединиться:</Text>
                  <Stack gap="xs">
                    {canJoin.map((role) => (
                      <Badge
                        key={role.id}
                        color={role.color}
                        size="lg"
                        variant="light"
                        radius="md"
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </Stack>
                </>
              )}
              {canWrite && (
                <>
                  <Text>Могут писать:</Text>
                  <Stack gap="xs">
                    {canWrite.map((role) => (
                      <Badge
                        key={role.id}
                        color={role.color}
                        size="lg"
                        variant="light"
                        radius="md"
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </Stack>
                </>
              )}
              {canWriteSub && (
                <>
                  <Text>Могут создавать подчаты:</Text>
                  <Stack gap="xs">
                    {canWriteSub.map((role) => (
                      <Badge
                        key={role.id}
                        color={role.color}
                        size="lg"
                        variant="light"
                        radius="md"
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </Stack>
                </>
              )}
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
                  data={getOptionsForChannelType(channelType)}
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
