import { Box, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Settings, Volume2 } from 'lucide-react';
import { useState } from 'react';

import { ChannelItemProps } from './ChannelItem.types';

import { SettingsChannelModal } from '~/components/SettingsChannelModal';
import { styles } from '~/modules/VoiceChannels';
import { ChannelType } from '~/store/ServerStore';

export const ChannelItem = ({
  channelId,
  channelName,
  isAdmin,
  handleConnect,
}: ChannelItemProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isHovered, setIsHovered] = useState('');

  const handleOpenChannelSettings = () => {
    open();
  };

  return (
    <>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        onMouseEnter={() => setIsHovered(channelId)}
        onMouseLeave={() => setIsHovered('')}
      >
        <Button
          leftSection={<Volume2 />}
          variant="transparent"
          p={0}
          color="#ffffff"
          justify="flex-start"
          styles={{
            root: {
              '--button-hover-color': '#4f4f4f',
              transition: 'color 0.3s ease',
            },
          }}
          fullWidth
          onClick={handleConnect}
        >
          {channelName}
        </Button>
        {isAdmin && isHovered === channelId && (
          <Button
            variant="subtle"
            p={0}
            color="#ffffff"
            justify="flex-start"
            w="20px"
            styles={{
              root: styles.buttonSettings,
            }}
            onClick={handleOpenChannelSettings}
          >
            <Settings size={16} />
          </Button>
        )}
      </Box>
      <SettingsChannelModal
        opened={opened}
        onClose={close}
        channelId={channelId}
        channelName={channelName}
        channelType={ChannelType.VOICE_CHANNEL}
      />
    </>
  );
};
