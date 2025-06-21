import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';

import { AddUserInChatProps } from './AddUserInChat.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { addUserInChat } from '~/store/ChatsStore';

export const AddUserInChat = ({ opened, close }: AddUserInChatProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const [userTag, setUserTag] = useState('');

  const handleAddUserInChat = async () => {
    if (activeChat) {
      const result = await dispatch(
        addUserInChat({
          accessToken,
          chatId: activeChat,
          userTag: userTag.trim(),
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Пользователь успешно добавлен');
        close();
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title="Добавление пользователя"
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
          <Button onClick={handleAddUserInChat}>Добавить</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
