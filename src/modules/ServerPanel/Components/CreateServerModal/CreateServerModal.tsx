import { Button, Group, Modal, Tabs, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useNotification } from '../../../../hooks/useNotification';
import {
  createServer,
  getUserServers,
  subscribeToServer,
} from '../../../../store/server/ServerActionCreators';

interface CreateServerModalProps {
  opened: boolean;
  onClose: () => void;
}

const CreateServerModal = ({ opened, onClose }: CreateServerModalProps) => {
  const [activeTab, setActiveTab] = useState<string | null>('create');
  const { showError } = useNotification();
  const { error } = useAppSelector((state) => state.testServerStore);
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) =>
        value.trim().length < 3
          ? 'Название сервера должно быть более 3 символов'
          : null,
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
      })
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
        serverId: values.serverId,
        userName: user.name,
      })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getUserServers({ accessToken }));
      form.reset();
      onClose();
    }
  };

  useEffect(() => {
    if (error !== '') showError(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="create">Создать сервер</Tabs.Tab>
          <Tabs.Tab value="connect">Подключиться к серверу</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="create">
          {' '}
          <form onSubmit={form.onSubmit(handleCreateSubmit)}>
            <TextInput
              label="Название сервера"
              placeholder="Введите название сервера"
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

export default CreateServerModal;
