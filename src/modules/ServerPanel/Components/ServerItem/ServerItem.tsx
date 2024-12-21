import { ActionIcon, Avatar } from '@mantine/core';

import { useAppDispatch } from '../../../../hooks/redux';
import { setOpenHome } from '../../../../store/app/AppSettingsSlice';
import { setCurrentServer } from '../../../../store/server/ServerSlice';
import { setCurrentServerId } from '../../../../store/server/TestServerSlice';

interface ServerItemProps {
  serverId: string;
  serverName: string;
}

const ServerItem = ({ serverId, serverName }: ServerItemProps) => {
  const dispatch = useAppDispatch();

  return (
    <ActionIcon
      size="xl"
      radius="xl"
      variant="transparent"
      onClick={() => {
        dispatch(setCurrentServer(serverId));
        dispatch(setCurrentServerId(serverId));
        dispatch(setOpenHome(false));
      }}
    >
      <Avatar size="md" color="blue">
        {serverName}
      </Avatar>
    </ActionIcon>
  );
};

export default ServerItem;
