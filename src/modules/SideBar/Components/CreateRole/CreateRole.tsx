import { Button, ColorInput, Modal, Stack, TextInput } from '@mantine/core';
import { Save } from 'lucide-react';
import { useState } from 'react';

import { CreateRoleProps } from './CreateRole.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { createRole } from '~/store/RolesStore';

export const CreateRole = ({ opened, onClose }: CreateRoleProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const [roleName, setRoleName] = useState('');
  const [color, setColor] = useState('#ffffff');

  const handleCreateRole = async () => {
    if (
      roleName.trim().length > 1 &&
      color.trim().length > 1 &&
      accessToken &&
      currentServerId
    ) {
      const result = await dispatch(
        createRole({
          accessToken,
          role: { serverId: currentServerId, name: roleName.trim(), color },
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Роль успешно создана');
        setRoleName('');
        setColor('#ffffff');
        onClose();
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Создание роли"
      size="auto"
    >
      <Stack>
        <TextInput
          label="Название роли"
          placeholder="Введите название роли"
          value={roleName}
          onChange={(event) => setRoleName(event.currentTarget.value)}
        />
        <ColorInput
          withEyeDropper={false}
          label="Выберите цвет"
          placeholder="#000000"
          value={color}
          onChange={setColor}
        />
        <Button
          leftSection={<Save />}
          variant="light"
          radius="md"
          onClick={handleCreateRole}
        >
          Создать
        </Button>
      </Stack>
    </Modal>
  );
};
