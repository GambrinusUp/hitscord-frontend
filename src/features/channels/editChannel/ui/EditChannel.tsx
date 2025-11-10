import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Settings } from 'lucide-react';

import { editChannelStyles } from './EditChannel.style';
import { SettingsChannelModal } from './SettingsChannelModal';

import { useAppSelector } from '~/hooks';
import { ChannelType } from '~/store/ServerStore';

interface EditChannelProps {
  channelName: string;
  channelId: string;
}

export const EditChannel = ({ channelName, channelId }: EditChannelProps) => {
  const { currentChannelId } = useAppSelector((state) => state.testServerStore);
  const [opened, { open, close }] = useDisclosure(false);

  const handleOpenChannelSettings = () => {
    open();
  };

  return (
    <>
      <Button
        variant="subtle"
        p={0}
        color="#ffffff"
        justify="flex-start"
        w="20px"
        styles={{
          root: editChannelStyles.buttonSettings(
            currentChannelId === channelId,
          ),
        }}
        onClick={handleOpenChannelSettings}
      >
        <Settings size={16} />
      </Button>
      <SettingsChannelModal
        opened={opened}
        onClose={close}
        channelId={channelId}
        channelName={channelName}
        channelType={ChannelType.NOTIFICATION_CHANNEL}
      />
    </>
  );
};
