import { ActionIcon, Avatar } from '@mantine/core';

import { useAppDispatch } from '../../../../hooks/redux';
import { setCurrentServer } from '../../../../store/server/ServerSlice';

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
      onClick={() => dispatch(setCurrentServer(serverId))}
    >
      <Avatar size="md" color="blue">
        {serverName}
      </Avatar>
    </ActionIcon>
  );
};

export default ServerItem;
