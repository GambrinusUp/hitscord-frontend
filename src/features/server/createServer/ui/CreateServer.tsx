import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CirclePlus } from 'lucide-react';

import { CreateServerModal } from './CreateServerModal';

export const CreateServer = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon size="lg" variant="transparent" onClick={open}>
        <CirclePlus size={24} color="#fff" />
      </ActionIcon>
      <CreateServerModal opened={opened} onClose={close} />
    </>
  );
};
