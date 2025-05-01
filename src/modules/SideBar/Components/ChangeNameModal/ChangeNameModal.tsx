import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';

import { ChangeNameModalProps } from './ChangeNameModal.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeNameOnServer } from '~/store/ServerStore';

export const ChangeNameModal = ({ opened, onClose }: ChangeNameModalProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const [newName, setNewName] = useState('');
  const { showSuccess } = useNotification();

  const handleChange = async () => {
    if (currentServerId) {
      const result = await dispatch(
        changeNameOnServer({
          accessToken,
          serverId: currentServerId,
          name: newName,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Имя успешно изменено');
        setNewName('');
        onClose();
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Изменение имени на сервере"
      centered
      c="#ffffff"
      styles={{
        header: {
          backgroundColor: '#1a1b1e',
        },
        content: {
          backgroundColor: '#1a1b1e',
        },
      }}
    >
      <Stack gap="xs">
        <TextInput
          label="Новое имя"
          placeholder="Введите новое имя"
          value={newName}
          onChange={(event) => setNewName(event.currentTarget.value)}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="filled" onClick={handleChange}>
            Изменить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
