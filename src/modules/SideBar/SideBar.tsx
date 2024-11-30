/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider, Stack, Text } from '@mantine/core';

import VoiceChannels from '../../components/VoiceChannels/VoiceChannels';
import { ActiveUser } from '../../utils/types';
import TextChannels from '../TextChannels/TextChannels';
import Panel from './Components/Panel/Panel';

interface SideBarProps {
  connect: () => void;
  disconnect: () => void;
  startScreenSharing: () => Promise<void>;
  stopScreenSharing: () => Promise<void>;
  consumers: any[];
  connected: boolean;
  users: any[];
  toggleMute: () => void;
  isMuted: boolean;
  isStreaming: boolean;
  onClose: () => void;
  activeUsers: ActiveUser[];
}

const SideBar = ({
  connect,
  disconnect,
  startScreenSharing,
  stopScreenSharing,
  consumers,
  connected,
  users,
  toggleMute,
  isMuted,
  isStreaming,
  onClose,
  activeUsers,
}: SideBarProps) => {
  return (
    <Stack
      gap="xs"
      bg="#1A1B1E"
      p={10}
      w={{ base: 150, lg: 250 }}
      h="100%"
      visibleFrom="sm"
    >
      <Text>Сервер #1</Text>
      <Divider />
      <TextChannels onClose={onClose} />
      <VoiceChannels
        connect={connect}
        connected={connected}
        consumers={consumers}
        users={users}
        activeUsers={activeUsers}
      />
      <Panel
        isConnected={connected}
        startScreenSharing={startScreenSharing}
        stopScreenSharing={stopScreenSharing}
        onDisconnect={disconnect}
        toggleMute={toggleMute}
        isMuted={isMuted}
        isStreaming={isStreaming}
      />
    </Stack>
  );
};

export default SideBar;
