import { ActionIcon, Button, Group } from '@mantine/core';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

import { CollapseButtonProps } from './CollapseButton.types';

export const CollapseButton = ({
  opened,
  toggle,
  canWorkChannels,
  handleAddChannel,
}: CollapseButtonProps) => {
  return (
    <Group justify="space-between" w="100%" wrap="nowrap">
      <Button
        leftSection={opened ? <ChevronDown /> : <ChevronRight />}
        variant="transparent"
        onClick={toggle}
        p={0}
        color="#fffff"
        styles={{
          root: {
            '--button-hover-color': '#4f4f4f',
            transition: 'color 0.3s ease',
          },
        }}
      >
        Голосовые каналы
      </Button>
      {canWorkChannels && (
        <ActionIcon variant="transparent" onClick={handleAddChannel}>
          <Plus color="#ffffff" />
        </ActionIcon>
      )}
    </Group>
  );
};
