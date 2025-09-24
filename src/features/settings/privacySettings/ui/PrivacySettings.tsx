import type { SettingsForm } from '~/entities/user';

import {
  Card,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface PrivacySettingsProps {
  isEdit: boolean;
  form: UseFormReturnType<SettingsForm>;
}

export const PrivacySettings = ({ isEdit, form }: PrivacySettingsProps) => {
  return (
    <Card
      withBorder
      radius="md"
      w="100%"
      styles={{ root: { backgroundColor: '#1a1b1e' } }}
    >
      <Title order={2}>Настройки приватности</Title>
      <Text c="dimmed">
        Управляйте тем, как другие пользователи могут взаимодействовать с вами
      </Text>
      <ScrollArea.Autosize w="100%" h="100%s">
        <Group justify="space-between" mt="lg">
          <Stack gap={0}>
            <Text>Уведомления</Text>
            <Text c="dimmed">Получать уведомления о новых сообщениях</Text>
          </Stack>
          <Switch
            disabled={!isEdit}
            defaultChecked
            size="lg"
            key={form.key('notifiable')}
            {...form.getInputProps('notifiable', { type: 'checkbox' })}
          />
        </Group>
        <Divider mt="lg" />
        <Group justify="space-between" mt="lg">
          <Stack gap={0}>
            <Text>Заявки в друзья</Text>
            <Text c="dimmed">
              Разрешить другим пользователям отправлять заявки в друзья
            </Text>
          </Stack>
          <Switch
            disabled={!isEdit}
            defaultChecked
            size="lg"
            key={form.key('friendshipApplication')}
            {...form.getInputProps('friendshipApplication', {
              type: 'checkbox',
            })}
          />
        </Group>
        <Divider mt="lg" />
        <Group justify="space-between" mt="lg">
          <Stack gap={0}>
            <Text>Сообщения от незнакомцев</Text>
            <Text c="dimmed">
              Разрешить получать сообщения от пользователей, которые не в списке
              друзей
            </Text>
          </Stack>
          <Switch
            disabled={!isEdit}
            defaultChecked
            size="lg"
            key={form.key('nonFriendMessage')}
            {...form.getInputProps('nonFriendMessage', { type: 'checkbox' })}
          />
        </Group>
      </ScrollArea.Autosize>
    </Card>
  );
};
