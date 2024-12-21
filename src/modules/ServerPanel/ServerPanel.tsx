import { ActionIcon, Divider, Flex, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CirclePlus, Home, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setOpenHome } from '../../store/app/AppSettingsSlice';
import { getUserServers } from '../../store/server/ServerActionCreators';
import { logoutUser } from '../../store/user/UserActionCreators';
import CreateServerModal from './Components/CreateServerModal/CreateServerModal';
import ServerItem from './Components/ServerItem/ServerItem';

const ServerPanel = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { serversList } = useAppSelector((state) => state.testServerStore);
  const { accessToken } = useAppSelector((state) => state.userStore);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser({ accessToken }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  useEffect(() => {
    if (accessToken) dispatch(getUserServers({ accessToken }));
  }, [accessToken, dispatch]);

  return (
    <Flex
      w="100%"
      maw={50}
      bg="#0E0E10"
      align="center"
      direction="column"
      justify="space-between"
      p="10px 0"
    >
      <Flex direction="column" align="center">
        <ActionIcon
          size="lg"
          variant="transparent"
          onClick={() => dispatch(setOpenHome(true))}
        >
          <Home size={24} color="#fff" />
        </ActionIcon>
        <Divider my="sm" />
        <Stack gap="sm" align="center">
          {serversList.map((server) => (
            <ServerItem
              key={server.serverId}
              serverId={server.serverId}
              serverName={server.serverName}
            />
          ))}
        </Stack>
        <Divider my="sm" />
        <ActionIcon size="lg" variant="transparent" onClick={open}>
          <CirclePlus size={24} color="#fff" />
        </ActionIcon>
      </Flex>
      <ActionIcon size="lg" variant="transparent" onClick={handleLogout}>
        <LogOut size={24} color="#fff" />
      </ActionIcon>
      <CreateServerModal opened={opened} onClose={close} />
    </Flex>
  );
};

export default ServerPanel;
