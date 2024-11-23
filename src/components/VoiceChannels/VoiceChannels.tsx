/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionIcon,
  Button,
  Collapse,
  Group,
  Menu,
  Modal,
  Slider,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  User,
  Video,
  Volume2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAppDispatch } from '../../hooks/redux';
import { getUserGroups } from '../../modules/ChatSectionWithUsers/utils/getUserGroups';
import { toggleUserStreamView } from '../../store/app/AppSettingsSlice';

interface VoiceChannelsProps {
  connect: () => void;
  connected: boolean;
  consumers: any[];
  users: { socketId: string; producerId: string; userName: string }[];
}

function VoiceChannels({
  connect,
  connected,
  consumers,
  users,
}: VoiceChannelsProps) {
  const dispatch = useAppDispatch();
  const [opened, { toggle }] = useDisclosure(true);
  const [selectedStream, setSelectedStream] = useState<MediaStream | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});

  const userGroups = getUserGroups(users);

  useEffect(() => {
    console.log('users: ', users);
  }, [users]);

  useEffect(() => {
    console.log('consumers: ', consumers);
  }, [consumers]);

  const handleConnect = () => {
    if (!connected) {
      connect();
    } else {
      dispatch(toggleUserStreamView());
    }
  };

  const handleUserClick = (socketId: string) => {
    const isStreaming = userGroups[socketId].producerIds.length > 1;

    if (isStreaming) {
      const videoConsumer = consumers.find(
        (consumer) =>
          consumer.kind === 'video' &&
          userGroups[socketId].producerIds.includes(consumer.producerId)
      );

      if (videoConsumer) {
        const stream = new MediaStream([videoConsumer.track]);
        setSelectedStream(stream);
        setModalOpen(true);
      }
    }
  };

  const handleVolumeChange = (socketId: string, value: number) => {
    const audioProducerId = userGroups[socketId].producerIds.find(
      (producerId) => {
        const consumer = consumers.find(
          (c) => c.producerId === producerId && c.kind === 'audio'
        );
        return !!consumer;
      }
    );

    if (audioProducerId) {
      setUserVolumes((prev) => ({
        ...prev,
        [audioProducerId]: value / 100,
      }));
    }
  };

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
            Голосовые каналы
          </Button>
          <ActionIcon variant="transparent">
            <Plus color="#ffffff" />
          </ActionIcon>
        </Group>
        <Collapse in={opened} w="100%">
          <Button
            leftSection={<Volume2 />}
            variant="transparent"
            p={0}
            color="#ffffff"
            justify="flex-start"
            styles={{
              root: {
                '--button-hover-color': '#4f4f4f',
                transition: 'color 0.3s ease',
              },
            }}
            fullWidth
            onClick={handleConnect}
          >
            Голосовой канал 1
          </Button>
          <Stack gap="xs">
            {Object.entries(userGroups).map(([socketId, { producerIds }]) => (
              <Menu key={socketId} shadow="md" width={200}>
                <Menu.Target>
                  <Group style={{ cursor: 'pointer' }} wrap="nowrap">
                    <User />
                    <Text truncate>{socketId}</Text>
                    {producerIds.length > 1 && (
                      <Video color="#43b581" style={{ marginLeft: 'auto' }} />
                    )}
                  </Group>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    <Slider
                      label="Громкость"
                      value={
                        (userVolumes[
                          producerIds.find((id) =>
                            consumers.some(
                              (c) => c.producerId === id && c.kind === 'audio'
                            )
                          ) || ''
                        ] || 1) * 100
                      }
                      onChange={(value) => handleVolumeChange(socketId, value)}
                      min={0}
                      max={100}
                    />
                  </Menu.Item>
                  {producerIds.length > 1 && (
                    <Menu.Item
                      leftSection={<Video />}
                      onClick={() => handleUserClick(socketId)}
                    >
                      Открыть стрим
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            ))}
          </Stack>
        </Collapse>
        {consumers.map(
          (consumer, index) =>
            consumer.kind === 'audio' && (
              <audio
                key={index}
                autoPlay
                ref={(el) => {
                  if (el) {
                    el.srcObject = new MediaStream([consumer.track]);
                    el.volume = userVolumes[consumer.producerId] ?? 1;
                  }
                }}
              />
            )
        )}
      </Stack>
      <Modal
        opened={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedStream(null);
        }}
        title="Просмотр стрима"
        centered
        size="auto"
        style={{ width: '100%' }}
      >
        {selectedStream && (
          <video
            style={{ width: '100%', height: 'auto', maxHeight: '700px' }}
            autoPlay
            ref={(el) => {
              if (el) el.srcObject = selectedStream;
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default VoiceChannels;
