import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';

import { CreateChannelModal } from './CreateChannelModal';

import { ChannelType } from '~/store/ServerStore';

export const CreateChannel = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleCreate = () => {
    open();
  };

  return (
    <>
      <ActionIcon variant="transparent" onClick={handleCreate}>
        <Plus color="#ffffff" />
      </ActionIcon>
      <CreateChannelModal
        opened={opened}
        onClose={close}
        channelType={ChannelType.NOTIFICATION_CHANNEL}
      />
    </>
  );
};
