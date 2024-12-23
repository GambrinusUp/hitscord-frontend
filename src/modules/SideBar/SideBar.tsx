import { Divider, Group, Menu, Skeleton, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, Copy, Settings } from 'lucide-react';

import { useAppSelector } from '../../hooks/redux';
import TextChannels from '../TextChannels/TextChannels';
import VoiceChannels from '../VoiceChannels/VoiceChannels';
import Panel from './Components/Panel/Panel';
import ServerSettingsModal from './Components/ServerSettingsModal/ServerSettingsModal';

interface SideBarProps {
  onClose: () => void;
}

const SideBar = ({ onClose }: SideBarProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { serverData, isLoading } = useAppSelector(
    (state) => state.testServerStore
  );
  const isAdmin = serverData.userRole === 'Admin' ? true : false;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
