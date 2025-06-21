import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';

import { ChangeChatNameProps } from './ChangeChatName.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { changeChatName } from '~/store/ChatsStore';

export const ChangeChatName = ({
  opened,
  close,
  currentChat,
  setCurrentChat,
}: ChangeChatNameProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const [chatName, setChatName] = useState('');

  const handleChaneChatName = async () => {
    if (currentChat) {
      const result = await dispatch(
        changeChatName({
          accessToken,
          chatId: currentChat.chatId,
          name: chatName.trim(),
        }),
      );

      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Чат успешно изменён');
        close();
        setCurrentChat(null);
      }
    }
  };

  useEffect(() => {
    if (currentChat) {
      setChatName(currentChat.chatName);
    }
  }, [currentChat]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title="Редактирование чата"
      styles={{
        content: { backgroundColor: '#2c2e33', color: '#ffffff' },
        header: { backgroundColor: '#2c2e33' },
      }}
    >
      <Stack gap="md">
        <TextInput
          label="Введите имя чата"
          placeholder="Название"
          value={chatName}
          onChange={(event) => setChatName(event.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button onClick={handleChaneChatName}>Изменить</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
