import { ActionIcon, Divider, Group, Stack, Text } from '@mantine/core';
import { Mic, MicOff, MonitorUp, MonitorX, PhoneMissed } from 'lucide-react';

import { useMediaContext } from '../../../../context/MediaContext/useMediaContext';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useDisconnect } from '../../../../hooks/useDisconnect';
import { useScreenSharing } from '../../../../hooks/useScreenSharing';
import { setUserStreamView } from '../../../../store/app/AppSettingsSlice';

const Panel = () => {
  const { isConnected, toggleMute, isMuted, isStreaming } = useMediaContext();
  const disconnect = useDisconnect();
  const { startScreenSharing, stopScreenSharing } = useScreenSharing();

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
            onClick={handleScreenShareClick}
            c="#ffffff"
          >
            {isStreaming ? <MonitorX /> : <MonitorUp />}
          </ActionIcon>
          <ActionIcon variant="transparent" onClick={toggleMute} c="#ffffff">
            {isMuted ? <MicOff /> : <Mic />}
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            onClick={() => {
              disconnect();
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
