import { Modal, Tabs, TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

import { useAppSelector, useAppDispatch } from '~/hooks';
import {
  combineValidators,
  maxLength,
  minLength,
} from '~/shared/lib/validators';
import {
  createServer,
  getUserServers,
  subscribeToServer,
} from '~/store/ServerStore';

interface CreateServerModalProps {
  opened: boolean;
  onClose: () => void;
}

export const CreateServerModal = ({
  opened,
  onClose,
}: CreateServerModalProps) => {
  const [activeTab, setActiveTab] = useState<string | null>('create');
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: combineValidators(
        minLength(6, 'Название сервера'),
        maxLength(50, 'Название сервера'),
      ),
    },
  });

  const connectForm = useForm({
    initialValues: { serverId: '' },
    validate: {
      serverId: (value) =>
        value.trim().length === 0 ? 'Введите ID сервера' : null,
    },
  });

  const handleCreateSubmit = async (values: typeof form.values) => {
    const result = await dispatch(
      createServer({
        accessToken,
        name: values.name,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getUserServers({ accessToken }));
      form.reset();
      onClose();
    }
  };

  const handleConnectSubmit = async (values: typeof connectForm.values) => {
    const result = await dispatch(
      subscribeToServer({
        accessToken,
        serverId: values.serverId.trim(),
        userName: user.name,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getUserServers({ accessToken }));
      form.reset();
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        activeTab === 'create'
          ? 'Создание нового сервера'
          : 'Подключение к серверу'
      }
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
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        styles={{
          tab: {
            '--tab-hover-color': '#4f4f4f',
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="create">Создать сервер</Tabs.Tab>
          <Tabs.Tab value="connect">Подключиться к серверу</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="create">
          <form onSubmit={form.onSubmit(handleCreateSubmit)}>
            <TextInput
              label="Название сервера"
              placeholder="Введите название сервера"
              description="от 6 до 50 символов"
              maxLength={50}
              {...form.getInputProps('name')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit">Создать</Button>
            </Group>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="connect">
          <form onSubmit={connectForm.onSubmit(handleConnectSubmit)}>
            <TextInput
              label="ID сервера"
              placeholder="Введите ID сервера"
              {...connectForm.getInputProps('serverId')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit">Подключиться</Button>
            </Group>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};
