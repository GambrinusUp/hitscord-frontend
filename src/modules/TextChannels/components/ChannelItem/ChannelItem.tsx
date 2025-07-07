import { Badge, Box, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Hash, Settings } from 'lucide-react';
import { useState } from 'react';

import { ChannelItemProps } from './ChannelItem.types';

import { SettingsChannelModal } from '~/components/SettingsChannelModal';
import { useAppSelector } from '~/hooks';
import { styles } from '~/modules/TextChannels';
import { ChannelType } from '~/store/ServerStore';

export const ChannelItem = ({
  channelId,
  currentChannelId,
  channelName,
  canWorkChannels,
  handleOpenChannel,
}: ChannelItemProps) => {
  const { hasNewMessage } = useAppSelector((state) => state.testServerStore);
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
        }}
        onMouseEnter={() => setIsHovered(channelId)}
        onMouseLeave={() => setIsHovered('')}
      >
        <Button
          leftSection={
            hasNewMessage && channelId === currentChannelId ? (
              <Badge circle>1</Badge>
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
          }}
          fullWidth
          onClick={handleOpenChannel}
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
