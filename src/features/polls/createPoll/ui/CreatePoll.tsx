import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChartBarIncreasing } from 'lucide-react';

import { CreatePollModal } from './CreatePollModal';

export const CreatePoll = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleCreatePoll = () => {
    open();
  };

  return (
    <>
      <ActionIcon
        component="label"
        size="xl"
        variant="transparent"
        onClick={handleCreatePoll}
      >
        <ChartBarIncreasing size={20} />
      </ActionIcon>
      <CreatePollModal opened={opened} close={close} />
    </>
  );
};
