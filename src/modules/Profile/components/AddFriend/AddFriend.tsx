import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';

import { AddFriendProps } from './AddFriend.types';

import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { createApplication } from '~/store/UserStore';

export const AddFriend = ({ opened, close }: AddFriendProps) => {
  const dispatch = useAppDispatch();
  const { showSuccess } = useNotification();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const [userTag, setUserTag] = useState('');

  const handleAddUserInChat = async () => {
    const result = await dispatch(
      createApplication({
        accessToken,
        userTag: userTag.trim(),
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Пользователь успешно добавлен');
      close();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title="Добавление друга"
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
