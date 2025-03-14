import { Box, Button } from '@mantine/core';
import { Settings, Volume2 } from 'lucide-react';
import { useState } from 'react';

import { styles } from '../../VoiceChannels.const';
import { ChannelItemProps } from './ChannelItem.types';

export const ChannelItem = ({
  channelId,
  channelName,
  isAdmin,
  handleConnect,
  handleEditChannel,
}: ChannelItemProps) => {
  const [isHovered, setIsHovered] = useState('');

  return (
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
          onClick={handleEditChannel}
        >
          <Settings size={16} />
        </Button>
      )}
    </Box>
  );
};
