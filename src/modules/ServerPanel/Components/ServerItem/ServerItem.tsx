import { ActionIcon, Avatar } from '@mantine/core';

import { ServerItemProps } from './ServerItem.types';

import { socket } from '~/api/socket';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setOpenHome, setUserStreamView } from '~/store/AppStore';
import { setCurrentServerId } from '~/store/ServerStore';

export const ServerItem = ({ serverId, serverName }: ServerItemProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userStore);

  const handleClick = () => {
    dispatch(setCurrentServerId(serverId));
    dispatch(setUserStreamView(false));
    dispatch(setOpenHome(false));
    socket.emit('setServer', {
      serverId,
      userName: user.name,
      userId: user.id,
    });
  };

  return (
    <ActionIcon
      size="xl"
      radius="xl"
      variant="transparent"
      onClick={handleClick}
    >
      <Avatar size="md" color="blue">
        {serverName}
      </Avatar>
    </ActionIcon>
  );
};
