import { ActionIcon, Button, Collapse, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, ChevronRight, Hash, Plus } from 'lucide-react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';

interface TextChannelsProps {
  onClose: () => void;
}

function TextChannels({ onClose }: TextChannelsProps) {
  const [opened, { toggle }] = useDisclosure(true);
  const [activeChannel, setActiveChannel] = useState<string>('channel1');
  const { server, currentChannelId } = useAppSelector(
    (state) => state.serverStore
  );
  const dispatch = useAppDispatch();

  return (
    <>
      <Stack align="flex-start" gap="xs">
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
            Текстовые каналы
          </Button>
          <ActionIcon variant="transparent">
            <Plus color="#ffffff" />
          </ActionIcon>
        </Group>
        <Collapse in={opened} w="100%">
          <Stack gap="xs">
            <Button
              leftSection={<Hash />}
              variant="subtle"
              p={0}
              color="#ffffff"
              justify="flex-start"
              styles={{
                root: {
                  backgroundColor:
                    activeChannel === 'channel1' ? '#999999' : 'transparent',
                  '--button-hover-color': '#4f4f4f',
                  transition: 'color 0.3s ease',
                },
              }}
              fullWidth
              onClick={() => {
                setActiveChannel('channel1');
                onClose();
              }}
            >
              Текстовый канал 1
            </Button>
            <Button
              leftSection={<Hash />}
              variant="subtle"
              p={0}
              color="#ffffff"
              justify="flex-start"
              styles={{
                root: {
                  backgroundColor:
                    activeChannel === 'channel2' ? '#999999' : 'transparent',
                  '--button-hover-color': '#4f4f4f',
                  transition: 'color 0.3s ease',
                },
              }}
              fullWidth
              onClick={() => {
                setActiveChannel('channel2');
                onClose();
              }}
            >
              Текстовый канал 2
            </Button>
          </Stack>
        </Collapse>
      </Stack>
    </>
  );
}

export default TextChannels;
