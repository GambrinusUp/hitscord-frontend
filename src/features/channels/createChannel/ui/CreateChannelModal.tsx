import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { getModalTitle } from '~/features/channels/createChannel/lib/getModalTitle';
import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  combineValidators,
  maxLength,
  minLength,
} from '~/shared/lib/validators';
import { ChannelType, createChannel, getServerData } from '~/store/ServerStore';

interface CreateChannelModalProps {
  opened: boolean;
  onClose: () => void;
  channelType: ChannelType;
}

interface CreateChannelForm {
  name: string;
}

export const CreateChannelModal = ({
  opened,
  onClose,
  channelType,
}: CreateChannelModalProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentServerId } = useAppSelector((state) => state.testServerStore);

  const form = useForm<CreateChannelForm>({
    initialValues: {
      name: '',
    },
    validate: {
      name: combineValidators(
        minLength(1, 'Название канала'),
        maxLength(100, 'Название канала'),
      ),
    },
  });

  const handleSubmit = async (values: CreateChannelForm) => {
    if (!currentServerId) {
      return;
    }

    const result = await dispatch(
      createChannel({
        accessToken,
        serverId: currentServerId,
        name: values.name,
        channelType,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getServerData({ accessToken, serverId: currentServerId }));
    }

    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={getModalTitle(channelType)}
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
          <Button type="submit">Создать</Button>
        </Group>
      </form>
    </Modal>
  );
};
