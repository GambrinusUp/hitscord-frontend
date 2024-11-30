import { Divider, Drawer, Stack, Text } from '@mantine/core';

import VoiceChannels from '../../../../components/VoiceChannels/VoiceChannels';
import { ActiveUser } from '../../../../utils/types';
import TextChannels from '../../../TextChannels/TextChannels';
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
  isStreaming: boolean;
  onClose: () => void;
  opened: boolean;
  activeUsers: ActiveUser[];
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
  isStreaming,
  onClose,
  opened,
  activeUsers,
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
      </Drawer>
    </>
  );
};

export default SideBarMobile;
