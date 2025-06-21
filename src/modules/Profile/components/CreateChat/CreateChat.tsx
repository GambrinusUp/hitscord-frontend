import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';

import { CreateChatProps } from './CreateChat.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { createChat } from '~/store/ChatsStore';

export const CreateChat = ({ opened, close }: CreateChatProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const [userTag, setUserTag] = useState('');

  const handleCreateChat = async () => {
    const result = await dispatch(createChat({ accessToken, userTag }));

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Чат успешно создан');
      close();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title="Создание чата"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
    >
      <Stack gap="md">
        <TextInput
          label="Введите usertag"
          placeholder="usertag#000000"
          value={userTag}
          onChange={(event) => setUserTag(event.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button onClick={handleCreateChat}>Создать</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
