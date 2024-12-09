import { Divider, Drawer, Stack, Text } from '@mantine/core';

import TextChannels from '../../../TextChannels/TextChannels';
import VoiceChannels from '../../../VoiceChannels/VoiceChannels';
import Panel from '../Panel/Panel';

interface SideBarMobileProps {
  onClose: () => void;
  opened: boolean;
}

const SideBarMobile = ({ onClose, opened }: SideBarMobileProps) => {
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
          <VoiceChannels />
          <Panel />
        </Stack>
      </Drawer>
    </>
  );
};

export default SideBarMobile;
