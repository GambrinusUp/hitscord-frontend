import { Divider, Drawer, Stack, Text } from '@mantine/core';

import TextChannels from '../../../../components/TextChannels/TextChannels';
import VoiceChannels from '../../../../components/VoiceChannels/VoiceChannels';
import Panel from '../Panel/Panel';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface SideBarMobileProps {
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
  opened: boolean;
}

const SideBarMobile = ({
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
  opened,
}: SideBarMobileProps) => {
  return (
    <>
      <Drawer
        opened={opened}
        onClose={onClose}
        size="xs"
        styles={{
          content: {
            backgroundColor: '#1A1B1E',
            color: '#ffffff',
          },
          header: {
            backgroundColor: '#1A1B1E',
          },
          body: {
            height: 'calc(100dvh - 60px)',
          },
        }}
      >
        <Stack gap="xs" bg="#1A1B1E" p={10} h="100%">
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
      </Drawer>
    </>
  );
};

export default SideBarMobile;
