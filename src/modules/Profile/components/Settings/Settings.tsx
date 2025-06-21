import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { hasLength, isEmail, useForm } from '@mantine/form';
import {
  Ban,
  Calendar,
  Mail,
  Pencil,
  Save,
  Tag,
  Upload,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import {
  changeSettings,
  changeUserProfile,
  SettingType,
} from '~/store/UserStore';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const { showSuccess } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: user.mail,
      name: user.name,
      notifiable: user.notifiable,
      friendshipApplication: user.friendshipApplication,
      nonFriendMessage: user.nonFriendMessage,
    },

    validate: {
      email: isEmail('Неправильный Email'),
      name: hasLength({ min: 2 }, 'Имя должно быть длиннее 2 символов'),
    },
  });

  const handleSave = async () => {
    form.validate();

    if (form.isValid()) {
      const values = form.getValues();
      let isSettingsChange = false;

      setIsLoading(true);

      if (values.friendshipApplication !== user.friendshipApplication) {
        const result = await dispatch(
          changeSettings({ accessToken, type: SettingType.FRIENDSHIP }),
        );

        isSettingsChange =
          result.meta.requestStatus === 'fulfilled' ? true : false;
      }

      if (values.nonFriendMessage !== user.nonFriendMessage) {
        const result = await dispatch(
          changeSettings({ accessToken, type: SettingType.NONFRIEND }),
        );

        isSettingsChange =
          result.meta.requestStatus === 'fulfilled' ? true : false;
      }

      if (values.notifiable !== user.notifiable) {
        const result = await dispatch(
          changeSettings({ accessToken, type: SettingType.NOTIFIABLE }),
        );

        isSettingsChange =
          result.meta.requestStatus === 'fulfilled' ? true : false;
      }

      if (isSettingsChange) {
        showSuccess('Настройки успешно изменены');
      }

      if (values.email !== user.mail || values.name !== user.name) {
        const result = await dispatch(
          changeUserProfile({
            accessToken,
            newProfile: { name: values.name, mail: values.email },
          }),
        );

        if (result.meta.requestStatus === 'fulfilled') {
          showSuccess('Профиль успешно изменен');
        }
      }

      setIsLoading(false);
      setIsEdit(false);
    }
  };

  return (
    <Stack p="xl" gap="md" w="100%">
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
              <Text c="dimmed">Аккаунт создан: {user.accontCreateDate}</Text>
            </Group>
            <Button variant="light" radius="md" leftSection={<Upload />}>
              Загрузить фото
            </Button>
          </Stack>
        </Group>
        <Divider mt="md" />
        <Stack mt="md">
          <TextInput
            leftSection={<User />}
            radius="md"
            label="Имя"
            placeholder="Введите имя"
            key={form.key('name')}
            {...form.getInputProps('name')}
            disabled={!isEdit}
          />
          <TextInput
            leftSection={<Mail />}
            radius="md"
            label="Электронная почта"
            placeholder="Введите электронную почту"
            key={form.key('email')}
            {...form.getInputProps('email')}
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
      </Card>
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
            {...form.getInputProps('notifiable')}
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
            {...form.getInputProps('friendshipApplication')}
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
            {...form.getInputProps('nonFriendMessage')}
          />
        </Group>
      </Card>
      <Group justify="flex-end">
        {!isEdit ? (
          <Button
            leftSection={<Pencil />}
            radius="md"
            size="md"
            onClick={() => setIsEdit(true)}
          >
            Редактировать профиль
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              leftSection={<Ban />}
              radius="md"
              size="md"
              onClick={() => {
                setIsEdit(false);
                form.setValues({
                  ...{
                    email: user.mail,
                    name: user.name,
                    notifiable: user.notifiable,
                    friendshipApplication: user.friendshipApplication,
                    nonFriendMessage: user.nonFriendMessage,
                  },
                });
              }}
              disabled={isLoading}
              loading={isLoading}
            >
              Отмена
            </Button>
            <Button
              leftSection={<Save />}
              radius="md"
              size="md"
              onClick={handleSave}
              disabled={isLoading}
              loading={isLoading}
            >
              Сохранить изменения
            </Button>
          </>
        )}
      </Group>
    </Stack>
  );
};
