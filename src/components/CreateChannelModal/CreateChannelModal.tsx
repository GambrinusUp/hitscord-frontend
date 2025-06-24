import {
  Button,
  Group,
  Modal,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

import { CreateChannelModalProps } from './CreateChannelModal.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import {
  ChannelType,
  createChannel,
  deleteChannel,
  getServerData,
} from '~/store/ServerStore';

export const CreateChannelModal = ({
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
      maxCount: isEdit.initialData,
    },
    validate: {
      name: (value) =>
        value.trim().length < 3
          ? 'Название канала должно быть более 3 символов'
          : null,
      maxCount: (value) =>
        Number(value) < 1 && channelType === ChannelType.VOICE_CHANNEL
          ? 'Кол-во пользователей должно быть больше 1'
          : Number(value) > 999 && channelType === ChannelType.VOICE_CHANNEL
            ? 'Кол-во пользователей должно быть меньше 999'
            : null,
    },
  });

  useEffect(() => {
    if (isEdit.isEdit) {
      form.setValues({ name: isEdit.initialData });
    } else {
      form.reset();
    }
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
        maxCount:
          channelType === ChannelType.VOICE_CHANNEL
            ? Number(values.maxCount)
            : undefined,
      }),
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
      }),
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
          {channelType === ChannelType.VOICE_CHANNEL && (
            <NumberInput
              label="Введите число"
              placeholder="Число от 1 до 999"
              {...form.getInputProps('maxCount')}
              min={1}
              max={999}
            />
          )}
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
