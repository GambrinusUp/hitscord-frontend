import { Divider, Stack, Text } from '@mantine/core';

import TextChannels from '../TextChannels/TextChannels';
import VoiceChannels from '../VoiceChannels/VoiceChannels';
import Panel from './Components/Panel/Panel';

interface SideBarProps {
  onClose: () => void;
}

const SideBar = ({ onClose }: SideBarProps) => {
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
      <VoiceChannels />
      <Panel />
    </Stack>
  );
};

export default SideBar;
