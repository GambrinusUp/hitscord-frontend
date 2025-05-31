import { Avatar, Button, Card, Group, Stack, Text } from '@mantine/core';
import { Check, X } from 'lucide-react';

import { UserItemProps, UserType } from './UserItem.types';

import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  approveApplication,
  declineApplication,
  deleteApplication,
  deleteFriendship,
} from '~/store/UserStore';

export const UserItem = ({
  applicationId,
  type,
  userName,
  userTag,
  userId,
}: UserItemProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);

  const handleDeleteApplication = () => {
    if (applicationId) {
      dispatch(deleteApplication({ accessToken, applicationId }));
    }
  };

  const handleApproveApplication = () => {
    if (applicationId) {
      dispatch(approveApplication({ accessToken, applicationId }));
    }
  };

  const handleDeclineApplication = () => {
    if (applicationId) {
      dispatch(declineApplication({ accessToken, applicationId }));
    }
  };

  const handleDeleteFriendship = () => {
    dispatch(deleteFriendship({ accessToken, userId }));
  };

  return (
    <Card bg="#2c2e33" padding="xs" radius="md" withBorder>
      <Group justify="space-between">
        <Group>
          <Avatar size="md" color="blue">
            {userName[0]}
          </Avatar>
          <Stack gap="xs">
            <Text c="white">{userName}</Text>
            <Text c="dimmed">{userTag}</Text>
          </Stack>
        </Group>
        <Group>
          {type === UserType.APPLICATION_TO && (
            <>
              <Button
                leftSection={<Check />}
                variant="light"
                color="green"
                radius="md"
                onClick={handleApproveApplication}
              >
                Принять
              </Button>
              <Button
                leftSection={<X />}
                variant="light"
                color="red"
                radius="md"
                onClick={handleDeclineApplication}
              >
                Отклонить
              </Button>
            </>
          )}
          {type === UserType.APPLICATION_FROM && (
            <Button
              leftSection={<X />}
              variant="light"
              color="red"
              radius="md"
              onClick={handleDeleteApplication}
            >
              Отменить
            </Button>
          )}
          {type === UserType.FRIEND && (
            <Button
              leftSection={<X />}
              variant="light"
              color="red"
              radius="md"
              onClick={handleDeleteFriendship}
            >
              Удалить из друзей
            </Button>
          )}
        </Group>
      </Group>
    </Card>
  );
};
