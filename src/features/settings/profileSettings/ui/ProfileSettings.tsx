import type { SettingsForm } from '~/entities/user';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Calendar, Mail, Tag, Upload, User } from 'lucide-react';

import { formatDateWithDots } from '~/helpers';
import { useAppSelector } from '~/hooks';

interface ProfileSettingsProps {
  isEdit: boolean;
  form: UseFormReturnType<SettingsForm>;
}

export const ProfileSettings = ({ isEdit, form }: ProfileSettingsProps) => {
  const { user } = useAppSelector((state) => state.userStore);

  return (
    <Card
      withBorder
      radius="md"
      w="100%"
      styles={{ root: { backgroundColor: '#1a1b1e' } }}
    >
      <Title order={2}>Информация о профиле</Title>
      <Text c="dimmed">Основная информация о вашем аккаунте</Text>
      <Group mt="md">
        {!user.icon && <Avatar src={null} alt="no image here" size="xl" />}
        <Stack>
          <Group>
            <Title order={4}>{user.name}</Title>
            <Badge variant="default">{user.tag}</Badge>
          </Group>
          <Group>
            <Calendar />
            <Text c="dimmed">
              Аккаунт создан: {formatDateWithDots(user.accontCreateDate)}
            </Text>
          </Group>
          <Button variant="light" radius="md" leftSection={<Upload />}>
            Загрузить фото
          </Button>
        </Stack>
      </Group>
      <Divider mt="md" />
      <ScrollArea.Autosize w="100%" h="100%s">
        <Stack mt="md">
          <TextInput
            leftSection={<User />}
            radius="md"
            label="Имя"
            placeholder="Введите имя"
            description="от 5 до 50 символов"
            key={form.key('name')}
            {...form.getInputProps('name')}
            maxLength={50}
            disabled={!isEdit}
          />
          <TextInput
            leftSection={<Mail />}
            radius="md"
            label="Электронная почта"
            placeholder="Введите электронную почту"
            key={form.key('email')}
            {...form.getInputProps('email')}
            maxLength={50}
            disabled={!isEdit}
          />
          <TextInput
            leftSection={<Tag />}
            radius="md"
            label="Тег пользователя"
            placeholder="Введите тег пользователя"
            value={user.tag}
            disabled
          />
        </Stack>
      </ScrollArea.Autosize>
    </Card>
  );
};
