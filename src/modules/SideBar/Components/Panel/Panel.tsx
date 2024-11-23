import { ActionIcon, Divider, Group, Stack, Text } from '@mantine/core';
import { Mic, MicOff, MonitorUp, MonitorX, PhoneMissed } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { setUserStreamView } from '../../../../store/app/AppSettingsSlice';

interface PanelProps {
  isConnected: boolean;
  startScreenSharing: () => Promise<void>;
  stopScreenSharing: () => Promise<void>;
  onDisconnect: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  isStreaming: boolean;
}

const Panel = ({
  isConnected,
  startScreenSharing,
  stopScreenSharing,
  onDisconnect,
  toggleMute,
  isMuted,
  isStreaming,
}: PanelProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userStore);

  const handleScreenShareClick = () => {
    if (isStreaming) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
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
            onClick={() => {
              onDisconnect();
              dispatch(setUserStreamView(false));
            }}
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
