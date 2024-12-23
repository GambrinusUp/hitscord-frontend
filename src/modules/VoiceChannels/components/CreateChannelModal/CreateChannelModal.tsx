import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useNotification } from '../../../../hooks/useNotification';
import {
  createChannel,
  getServerData,
} from '../../../../store/server/ServerActionCreators';
import { ChannelType } from '../../../../utils/types';

interface CreateChannelModalProps {
  opened: boolean;
  onClose: () => void;
  serverId: string;
}

const CreateChannelModal = ({
  opened,
  onClose,
  serverId,
}: CreateChannelModalProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { error } = useAppSelector((state) => state.testServerStore);
  const { showError } = useNotification();

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) =>
        value.trim().length < 3
          ? 'Название канала должно быть более 3 символов'
          : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const result = await dispatch(
      createChannel({
        accessToken,
        serverId,
        name: values.name,
        channelType: ChannelType.VOICE_CHANNEL,
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getServerData({ accessToken, serverId }));
    }

    form.reset();
    onClose();
  };

  useEffect(() => {
    if (error) {
      showError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={'Создание голосового канала'}
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
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Название канала"
          placeholder="Введите название канала"
          {...form.getInputProps('name')}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">Сохранить</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
