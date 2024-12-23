import { ActionIcon, Avatar } from '@mantine/core';

import socket from '../../../../api/socket';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import {
  setOpenHome,
  setUserStreamView,
} from '../../../../store/app/AppSettingsSlice';
import { setCurrentServer } from '../../../../store/server/ServerSlice';
import { setCurrentServerId } from '../../../../store/server/TestServerSlice';

interface ServerItemProps {
  serverId: string;
  serverName: string;
}

const ServerItem = ({ serverId, serverName }: ServerItemProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userStore);

  const handleClick = () => {
    dispatch(setCurrentServer(serverId));
    dispatch(setCurrentServerId(serverId));
    dispatch(setUserStreamView(false));
    dispatch(setOpenHome(false));
    socket.emit('setServer', { serverId, user: user.name });
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

export default ServerItem;
