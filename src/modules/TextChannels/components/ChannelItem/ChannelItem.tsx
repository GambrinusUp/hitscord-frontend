import { Badge, Box, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Hash, Settings } from 'lucide-react';
import { useState } from 'react';

import { ChannelItemProps } from './ChannelItem.types';

import { SettingsChannelModal } from '~/components/SettingsChannelModal';
import { styles } from '~/modules/TextChannels';
import { ChannelType } from '~/store/ServerStore';

export const ChannelItem = ({
  channelId,
  currentChannelId,
  channelName,
  canWorkChannels,
  nonReadedCount,
  handleOpenChannel,
}: ChannelItemProps) => {
  const [isHovered, setIsHovered] = useState('');
  const [opened, { open, close }] = useDisclosure(false);

  const handleOpenChannelSettings = () => {
    open();
  };

  return (
    <>
      <Box
        key={channelId}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 230,
        }}
        onMouseEnter={() => setIsHovered(channelId)}
        onMouseLeave={() => setIsHovered('')}
      >
        <Button
          leftSection={
            nonReadedCount > 0 ? (
              <Badge circle>{nonReadedCount}</Badge>
            ) : (
              <Hash />
            )
          }
          variant="subtle"
          p={0}
          color="#ffffff"
          justify="flex-start"
          styles={{
            root: styles.buttonRoot(
              isHovered === channelId,
              currentChannelId === channelId,
            ),
            label: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              wordBreak: 'break-all',
              maxWidth: '100%',
            },
          }}
          onClick={handleOpenChannel}
          fullWidth
        >
          {channelName}
        </Button>
        {canWorkChannels && isHovered === channelId && (
          <Button
            variant="subtle"
            p={0}
            color="#ffffff"
            justify="flex-start"
            w="20px"
            styles={{
              root: styles.buttonSettings(currentChannelId === channelId),
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
        channelType={ChannelType.TEXT_CHANNEL}
      />
    </>
  );
};
