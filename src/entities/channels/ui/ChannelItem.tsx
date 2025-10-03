import { Box, Button } from '@mantine/core';
import { Hash } from 'lucide-react';
import { useState } from 'react';

import { channelItemStyles } from './ChannelItem.styles';

import { useAppSelector } from '~/hooks';

interface ChannelItemProps {
  channelId: string;
  channelName: string;
  openChannel: () => void;
  editAction: React.ReactNode;
}

export const ChannelItem = ({
  channelId,
  channelName,
  openChannel,
  editAction,
}: ChannelItemProps) => {
  const { serverData, currentChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const canWorkChannels = serverData.permissions.canWorkChannels;

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
          root: channelItemStyles.buttonRoot(
            isHovered === channelId,
            currentChannelId === channelId,
          ),
        }}
        fullWidth
        onClick={openChannel}
      >
        {channelName}
      </Button>
      {canWorkChannels && isHovered === channelId && editAction}
    </Box>
  );
};
