import { Box, Button } from '@mantine/core';
import { Hash, Settings } from 'lucide-react';
import { useState } from 'react';

import { ChannelItemProps } from './ChannelItem.types';

import { styles } from '~/modules/TextChannels';

export const ChannelItem = ({
  channelId,
  currentChannelId,
  channelName,
  isAdmin,
  handleEditChannel,
  handleOpenChannel,
}: ChannelItemProps) => {
  const [isHovered, setIsHovered] = useState('');

  return (
    <Box
      key={channelId}
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => setIsHovered(channelId)}
      onMouseLeave={() => setIsHovered('')}
    >
      <Button
        leftSection={<Hash />}
        variant="subtle"
        p={0}
        color="#ffffff"
        justify="flex-start"
        styles={{
          root: styles.buttonRoot(
            isHovered === channelId,
            currentChannelId === channelId,
          ),
        }}
        fullWidth
        onClick={handleOpenChannel}
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
            root: styles.buttonSettings(currentChannelId === channelId),
          }}
          onClick={handleEditChannel}
        >
          <Settings size={16} />
        </Button>
      )}
    </Box>
  );
};
