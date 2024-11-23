import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../../../../hooks/redux';
import {
  addTextChannel,
  deleteTextChannel,
  editTextChannel,
} from '../../../../store/server/ServerSlice';
import { EditModal } from '../../../../utils/types';

interface CreateChannelModalProps {
  opened: boolean;
  onClose: () => void;
  isEdit: EditModal;
  serverId: string;
}

const CreateChannelModal = ({
  opened,
  onClose,
  isEdit,
  serverId,
}: CreateChannelModalProps) => {
  const dispatch = useAppDispatch();

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

  const handleSubmit = (values: typeof form.values) => {
    if (isEdit.isEdit) {
      dispatch(
        editTextChannel({
          serverId: serverId,
          channelId: isEdit.channelId,
          name: values.name,
        })
      );
      onClose();
    } else {
      const newGuid = uuidv4();
      dispatch(
        addTextChannel({
          serverId: serverId,
          channelId: newGuid,
          name: values.name,
        })
      );
      form.reset();
      onClose();
    }
  };

  const handleDelete = () => {
    dispatch(
      deleteTextChannel({
        serverId: serverId,
        channelId: isEdit.channelId,
      })
    );
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        isEdit.isEdit
          ? 'Редактирование текстового канала'
          : 'Создание текстового канала'
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
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Название канала"
          placeholder="Введите название канала"
          {...form.getInputProps('name')}
        />
        <Group justify="flex-end" mt="md">
          {isEdit.isEdit && (
            <Button variant="filled" color="red" onClick={handleDelete}>
              Удалить
            </Button>
          )}
          {!isEdit.isEdit && (
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
          )}
          <Button type="submit">
            {isEdit.isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
