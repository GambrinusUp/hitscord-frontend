import { Button, Group, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useNotification } from '../../hooks/useNotification';
import {
  createChannel,
  deleteChannel,
  getServerData,
} from '../../store/server/ServerActionCreators';
import { ChannelType, EditModal } from '../../utils/types';

interface CreateChannelModalProps {
  opened: boolean;
  onClose: () => void;
  isEdit: EditModal;
  serverId: string;
  channelType: ChannelType;
}

const CreateChannelModal = ({
  opened,
  onClose,
  isEdit,
  serverId,
  channelType,
}: CreateChannelModalProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { error } = useAppSelector((state) => state.testServerStore);
  const { showError } = useNotification();

  const form = useForm({
    initialValues: {
      name: isEdit.initialData,
    },
    validate: {
      name: (value) =>
        value.trim().length < 3
          ? 'Название канала должно быть более 3 символов'
          : null,
    },
  });

  useEffect(() => {
    if (isEdit.isEdit) {
      form.setValues({ name: isEdit.initialData });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const handleSubmit = async (values: typeof form.values) => {
    const result = await dispatch(
      createChannel({
        accessToken,
        serverId,
        name: values.name,
        channelType:
          channelType === ChannelType.TEXT_CHANNEL
            ? ChannelType.TEXT_CHANNEL
            : ChannelType.VOICE_CHANNEL,
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getServerData({ accessToken, serverId }));
    }

    onClose();
  };

  const handleDelete = async () => {
    const result = await dispatch(
      deleteChannel({
        accessToken,
        channelId: isEdit.channelId,
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getServerData({ accessToken, serverId }));
    }

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
      title={
        isEdit.isEdit
          ? `Редактирование ${
              channelType === ChannelType.TEXT_CHANNEL
                ? 'текстового'
                : 'голосового'
            } канала`
          : `Создание ${
              channelType === ChannelType.TEXT_CHANNEL
                ? 'текстового'
                : 'голосового'
            } канала`
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
      {isEdit.isEdit ? (
        <>
          <Text fz="md" fw="bold">
            Имя канала: {isEdit.initialData}
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="filled" color="red" onClick={handleDelete}>
              Удалить
            </Button>
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </Group>
        </>
      ) : (
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
            <Button type="submit">Создать</Button>
          </Group>
        </form>
      )}
    </Modal>
  );
};

export default CreateChannelModal;
