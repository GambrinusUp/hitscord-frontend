/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider, Stack, Text } from '@mantine/core';

import TextChannels from '../../components/TextChannels/TextChannels';
import VoiceChannels from '../../components/VoiceChannels/VoiceChannels';
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
  onClose: () => void;
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
  onClose,
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
      />
      <Panel
        isConnected={connected}
        startScreenSharing={startScreenSharing}
        stopScreenSharing={stopScreenSharing}
        onDisconnect={disconnect}
        toggleMute={toggleMute}
        isMuted={isMuted}
      />
    </Stack>
  );
};

export default SideBar;
