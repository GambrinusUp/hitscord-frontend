import { Divider, Group, Menu, Skeleton, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, Copy, DoorOpen, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setOpenHome } from '../../store/app/AppSettingsSlice';
import {
  getUserServers,
  unsubscribeFromServer,
} from '../../store/server/ServerActionCreators';
import { clearServerData } from '../../store/server/TestServerSlice';
import TextChannels from '../TextChannels/TextChannels';
import VoiceChannels from '../VoiceChannels/VoiceChannels';
import Panel from './Components/Panel/Panel';
import ServerSettingsModal from './Components/ServerSettingsModal/ServerSettingsModal';

interface SideBarProps {
  onClose: () => void;
}

const SideBar = ({ onClose }: SideBarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const { serverData, isLoading } = useAppSelector(
    (state) => state.testServerStore
  );
  const { accessToken } = useAppSelector((state) => state.userStore);
  const isAdmin = serverData.userRole === 'Admin' ? true : false;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUnsubscribe = async () => {
    const result = await dispatch(
      unsubscribeFromServer({ accessToken, serverId: serverData.serverId })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getUserServers({ accessToken }));
      dispatch(setOpenHome(true));
      dispatch(clearServerData());
      navigate('/main');
    }
  };

  return (
    <>
      <Stack
        gap="xs"
        bg="#1A1B1E"
        p={10}
        w={{ base: 150, lg: 250 }}
        h="100%"
        visibleFrom="sm"
      >
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Group justify="space-between" style={{ cursor: 'pointer' }}>
              {isLoading ? (
                <>
                  <Skeleton height={10} width="40%" radius="md" />
                </>
              ) : (
                <Text>{serverData.serverName}</Text>
              )}
              <ChevronDown />
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            {isAdmin && (
              <Menu.Item leftSection={<Settings size={16} />} onClick={open}>
                Настройки сервера
              </Menu.Item>
            )}
            <Menu.Item
              onClick={() => copyToClipboard(serverData.serverId)}
              leftSection={<Copy size={16} />}
            >
              Копировать ID сервера
            </Menu.Item>
            {!isAdmin && (
              <Menu.Item
                onClick={handleUnsubscribe}
                leftSection={<DoorOpen size={16} />}
              >
                Отписаться от сервера
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
        <Divider />
        <TextChannels onClose={onClose} />
        <VoiceChannels />
        <Panel />
      </Stack>
      <ServerSettingsModal opened={opened} onClose={close} />
    </>
  );
};

export default SideBar;
