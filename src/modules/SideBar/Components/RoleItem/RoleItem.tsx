import {
  Button,
  Card,
  ColorSwatch,
  Group,
  Pill,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Pencil, Trash2, UserRoundCog } from 'lucide-react';

import { RoleItemProps } from './RoleItem.types';

import { SETTINGS_NAMES } from '~/constants';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { deleteRole } from '~/store/RolesStore';

export const RoleItem = ({ role, editRole, editSettings }: RoleItemProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentServerId } = useAppSelector((state) => state.testServerStore);

  const handleDelete = async () => {
    if (accessToken && currentServerId) {
      const result = await dispatch(
        deleteRole({
          accessToken,
          serverId: currentServerId,
          roleId: role.role.id,
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Роль успешна удалена');
      }
    }
  };

  return (
    <Card p="md" radius="md">
      <Stack>
        <Group justify="space-between">
          <Group>
            <ColorSwatch color={role.role.color} />
            <Stack gap="0">
              <Title order={3}>{role.role.name}</Title>
              <Text c="dimmed">#{role.role.tag}</Text>
            </Stack>
          </Group>
          <Group>
            <Button
              variant="light"
              radius="md"
              leftSection={<UserRoundCog />}
              onClick={() => editSettings(role)}
            >
              Настройки
            </Button>
            <Button
              variant="light"
              radius="md"
              leftSection={<Pencil />}
              onClick={() => editRole(role)}
            >
              Изменить
            </Button>
            <Button
              variant="light"
              radius="md"
              leftSection={<Trash2 />}
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </Group>
        </Group>
        <Group>
          {Object.entries(role.settings)
            .filter(([_, value]) => value === true)
            .map(([key]) => (
              <Pill key={key} radius="sm">
                {SETTINGS_NAMES[key as keyof typeof SETTINGS_NAMES] || key}
              </Pill>
            ))}
        </Group>
      </Stack>
    </Card>
  );
};
