import { ActionIcon, Divider, Group, Stack, Text } from '@mantine/core';
import { Mic, MicOff, MonitorUp, MonitorX, PhoneMissed } from 'lucide-react';
import { useState } from 'react';

import { useAppSelector } from '../../../../hooks/redux';

interface PanelProps {
  isConnected: boolean;
  startScreenSharing: () => Promise<void>;
  stopScreenSharing: () => Promise<void>;
  onDisconnect: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const Panel = ({
  isConnected,
  startScreenSharing,
  stopScreenSharing,
  onDisconnect,
  toggleMute,
  isMuted,
}: PanelProps) => {
  const { user } = useAppSelector((state) => state.userStore);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleScreenShareClick = () => {
    if (isStreaming) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
    setIsStreaming((prev) => !prev);
  };

  return (
    <Stack mt="auto">
      {isConnected && (
        <Group gap="xs" justify="space-between">
          <ActionIcon
            variant="transparent"
            aria-label="Settings"
            onClick={handleScreenShareClick}
            c="#ffffff"
          >
            {isStreaming ? <MonitorX /> : <MonitorUp />}
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            aria-label="Settings"
            onClick={toggleMute}
            c="#ffffff"
          >
            {isMuted ? <MicOff /> : <Mic />}
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            aria-label="Settings"
            onClick={onDisconnect}
            c="#ffffff"
          >
            <PhoneMissed />
          </ActionIcon>
        </Group>
      )}
      <Divider />
      <Text truncate>{user.fullName}</Text>
    </Stack>
  );
};

export default Panel;
