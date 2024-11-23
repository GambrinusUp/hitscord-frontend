import { ActionIcon, Divider, Flex, Stack } from '@mantine/core';
import { CirclePlus, Home } from 'lucide-react';
import { useEffect } from 'react';

import { useAppSelector } from '../../hooks/redux';
import ServerItem from './Components/ServerItem/ServerItem';

const ServerPanel = () => {
  const { servers } = useAppSelector((state) => state.serverStore);

  useEffect(() => {
    console.log(servers);
  }, [servers]);

  return (
    <Flex w={50} bg="#0E0E10" align="center" direction="column" p="10px 0">
      <ActionIcon size="lg" variant="transparent">
        <Home size={24} color="#fff" />
      </ActionIcon>
      <Divider my="sm" />
      <Stack gap="sm" align="center">
        {Object.entries(servers).map(([serverId, server]) => (
          <ServerItem
            key={serverId}
            serverId={serverId}
            serverName={server.name}
          />
        ))}
      </Stack>
      <Divider my="sm" />
      <ActionIcon size="lg" variant="transparent">
        <CirclePlus size={24} color="#fff" />
      </ActionIcon>
    </Flex>
  );
};

export default ServerPanel;
