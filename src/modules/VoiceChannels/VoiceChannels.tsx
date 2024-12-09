import {
  ActionIcon,
  Button,
  Collapse,
  Group,
  Menu,
  //Modal,
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
import { useEffect, useRef, useState } from 'react';

import { useMediaContext } from '../../context/MediaContext/useMediaContext';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useConnect } from '../../hooks/useConnect';
import {
  setUserStreamView,
  toggleUserStreamView,
} from '../../store/app/AppSettingsSlice';
import { getUserGroups } from '../ChatSectionWithUsers/utils/getUserGroups';
import { useActiveUsers } from './VoiceChannels.hooks';

function VoiceChannels() {
  const connect = useConnect();
  const { isConnected, consumers, users, setSelectedUserId } =
    useMediaContext();
  const { user, roomName } = useAppSelector((state) => state.userStore);
  const dispatch = useAppDispatch();
  const [opened, { toggle }] = useDisclosure(true);
  //const [selectedStream, setSelectedStream] = useState<MediaStream | null>(null);
  //const [isModalOpen, setModalOpen] = useState(false);
  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});
  const activeUsers = useActiveUsers();
  const userGroups = getUserGroups(users);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const handleConnect = () => {
    if (!isConnected) {
      connect(roomName, user.fullName);
    } else {
      dispatch(toggleUserStreamView());
    }
  };

  /*const handleUserClick = (socketId: string) => {
    const isStreaming = userGroups[socketId].producerIds.length > 1;

    if (isStreaming) {
      const videoConsumer = consumers.find(
        (consumer) =>
          consumer.kind === 'video' &&
          userGroups[socketId].producerIds.includes(consumer.producerId)
      );

      console.log(videoConsumer);

      if (videoConsumer) {
        const stream = new MediaStream([videoConsumer.track]);
        console.log(stream);
        setSelectedStream(stream);
        setModalOpen(true);
      }
    }
  };*/

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

  useEffect(() => {
    consumers.forEach((consumer) => {
      if (consumer.kind === 'audio') {
        const { producerId, track } = consumer;

        if (!audioRefs.current.has(producerId)) {
          const audio = document.createElement('audio');
          audio.srcObject = new MediaStream([track]);
          audio.autoplay = true;
          audio.volume = userVolumes[producerId] ?? 1;
          audioRefs.current.set(producerId, audio);
          document.body.appendChild(audio);
        }
      }
    });

    const activeProducers = consumers.map((c) => c.producerId);
    audioRefs.current.forEach((audio, producerId) => {
      if (!activeProducers.includes(producerId)) {
        audio.pause();
        audio.remove();
        audioRefs.current.delete(producerId);
      }
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.remove();
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioRefs.current.clear();
    };
  }, [consumers, userVolumes]);

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
            {Object.entries(userGroups).map(([socketId, { producerIds }]) => {
              const isSpeaking = producerIds.some((id) =>
                activeUsers.some((user) => user.producerId === id)
              );

              return (
                <Menu
                  key={socketId}
                  shadow="md"
                  width={200}
                  closeOnItemClick={true}
                >
                  <Menu.Target>
                    <Group style={{ cursor: 'pointer' }} wrap="nowrap">
                      <User color={isSpeaking ? '#43b581' : undefined} />
                      <Text truncate>{socketId}</Text>
                      {producerIds.length > 1 && (
                        <Video color="#43b581" style={{ marginLeft: 'auto' }} />
                      )}
                    </Group>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<Volume2 />}>
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
                        onChange={(value) =>
                          handleVolumeChange(socketId, value)
                        }
                        min={1}
                        max={100}
                      />
                    </Menu.Item>
                    {producerIds.length > 1 && (
                      <Menu.Item
                        leftSection={<Video />}
                        onClick={() => {
                          setSelectedUserId(socketId);
                          dispatch(setUserStreamView(true));
                        }}
                      >
                        Открыть стрим
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
              );
            })}
          </Stack>
        </Collapse>
      </Stack>
      {/*<Modal
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
      </Modal>*/}
    </>
  );
}

export default VoiceChannels;
