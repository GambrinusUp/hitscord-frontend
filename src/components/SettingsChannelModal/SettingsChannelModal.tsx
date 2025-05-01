import {
  Button,
  Group,
  Modal,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { SettingsChannelModalProps } from './SettingsChannelModal.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeChannelName, deleteChannel } from '~/store/ServerStore';

export const SettingsChannelModal = ({
  opened,
  onClose,
  channelId,
  channelName,
}: SettingsChannelModalProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const [activeSetting, setActiveSetting] = useState<'name' | 'delete'>('name');
  const [newChannelName, setNewChannelName] = useState(channelName);
  const [loading, setLoading] = useState(false);
  const { showSuccess } = useNotification();

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
        </ScrollArea>
      </Group>
    </Modal>
  );
};
