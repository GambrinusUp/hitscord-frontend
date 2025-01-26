import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Group,
  Menu,
  Slider,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  User,
  Video,
  Volume2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

import socket from '../../api/socket';
import CreateChannelModal from '../../components/CreateChannelModal/CreateChannelModal';
import { useMediaContext } from '../../context/MediaContext/useMediaContext';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useConnect } from '../../hooks/useConnect';
import { useDisconnect } from '../../hooks/useDisconnect';
import {
  setUserStreamView,
  toggleUserStreamView,
} from '../../store/app/AppSettingsSlice';
import { setCurrentVoiceChannelId } from '../../store/server/TestServerSlice';
import { ChannelType, EditModal } from '../../utils/types';
import { getUserGroups } from '../ChatSectionWithUsers/utils/getUserGroups';
import { styles } from './VoiceChannels.const';
import { useActiveUsers } from './VoiceChannels.hooks';

function VoiceChannels() {
  const connect = useConnect();
  const disconnect = useDisconnect();
  const { isConnected, consumers, users, setSelectedUserId } =
    useMediaContext();
  const { user } = useAppSelector((state) => state.userStore);
  const { serverData, currentVoiceChannelId, currentServerId } = useAppSelector(
    (state) => state.testServerStore
  );
  const dispatch = useAppDispatch();
  const [opened, { toggle }] = useDisclosure(true);
  const [
    channelModalOpened,
    { open: openChannelModal, close: closeChannelModal },
  ] = useDisclosure(false);
  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});
  const activeUsers = useActiveUsers();
  const rooms = getUserGroups(users);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const isAdmin = serverData.userRole === 'Admin' ? true : false;
  const [isHovered, setIsHovered] = useState('');
  const [isEditing, setIsEditing] = useState<EditModal>({
    isEdit: false,
    initialData: '',
    channelId: '',
  });

  const handleConnect = (channelId: string) => {
    if (!isConnected) {
      dispatch(setCurrentVoiceChannelId(channelId));
      connect(channelId, user.name, serverData.serverId);
    } else {
      if (channelId === currentVoiceChannelId) {
        dispatch(toggleUserStreamView());
      } else {
        disconnect();
        dispatch(setUserStreamView(false));
        dispatch(setCurrentVoiceChannelId(channelId));
        connect(channelId, user.name, serverData.serverId);
      }
    }
  };

  const handleVolumeChange = (socketId: string, value: number) => {
    if (!currentVoiceChannelId) return;

    const room = rooms.find((room) => room.roomName === currentVoiceChannelId);
    if (!room) return;

    const user = room.users[socketId];
    if (!user) return;

    const audioProducerId = user.producerIds.find((producerId) => {
      const consumer = consumers.find(
        (c) => c.producerId === producerId && c.kind === 'audio'
      );
      return !!consumer;
    });

    if (audioProducerId) {
      setUserVolumes((prev) => ({
        ...prev,
        [audioProducerId]: value / 100,
      }));
    }
  };

  const handleAddChannel = () => {
    setIsEditing({ isEdit: false, initialData: '', channelId: '' });
    openChannelModal();
  };

  const handleKickUser = (socketId: string) => {
    console.log(socketId);
    socket.emit(
      'kickUser',
      { targetSocketId: socketId },
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          console.log('Пользователь успешно кикнут:', response.message);
        } else {
          console.error('Ошибка кикания пользователя:', response.message);
        }
      }
    );
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

  useEffect(() => {
    if (!socket) return;

    socket.on('kickedUser', () => {
      disconnect();
      dispatch(setUserStreamView(false));
      dispatch(setCurrentVoiceChannelId(null));
    });

    return () => {
      socket.off('producerClosed');
    };
  }, [disconnect, dispatch]);

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
          {isAdmin && (
            <ActionIcon variant="transparent" onClick={handleAddChannel}>
              <Plus color="#ffffff" />
            </ActionIcon>
          )}
        </Group>
        <Collapse in={opened} w="100%">
          <Stack gap="xs">
            {serverData.channels.voiceChannels.map(
              ({ channelId, channelName }) => (
                <React.Fragment key={channelId}>
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseEnter={() => setIsHovered(channelId)}
                    onMouseLeave={() => setIsHovered('')}
                  >
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
                      onClick={() => handleConnect(channelId)}
                    >
                      {channelName}
                    </Button>
                    {isAdmin && isHovered === channelId && (
                      <Button
                        variant="subtle"
                        p={0}
                        color="#ffffff"
                        justify="flex-start"
                        w="20px"
                        styles={{
                          root: styles.buttonSettings,
                        }}
                        onClick={() => {
                          setIsEditing({
                            isEdit: true,
                            initialData: channelName,
                            channelId: channelId,
                          });
                          openChannelModal();
                        }}
                      >
                        <Settings size={16} />
                      </Button>
                    )}
                  </Box>

                  <Stack gap="xs">
                    {rooms
                      .filter((room) => room.roomName === channelId)
                      .flatMap((room) =>
                        Object.entries(room.users).map(
                          ([socketId, { producerIds, userName }]) => {
                            const isSpeaking =
                              producerIds.some((id) =>
                                activeUsers.some(
                                  (user) => user.producerId === id
                                )
                              ) && channelId === currentVoiceChannelId;

                            return (
                              <Menu
                                key={socketId}
                                shadow="md"
                                width={200}
                                closeOnItemClick={true}
                              >
                                <Menu.Target>
                                  <Group
                                    style={{ cursor: 'pointer' }}
                                    wrap="nowrap"
                                  >
                                    <User
                                      color={isSpeaking ? '#43b581' : undefined}
                                      style={{
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Text truncate="end">{userName}</Text>
                                    {producerIds.length > 1 && (
                                      <Video
                                        color="#43b581"
                                        style={{
                                          marginLeft: 'auto',
                                          flexShrink: 0,
                                        }}
                                      />
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
                                              (c) =>
                                                c.producerId === id &&
                                                c.kind === 'audio'
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
                                  {isAdmin && (
                                    <Menu.Item
                                      leftSection={<Video />}
                                      onClick={() => {
                                        handleKickUser(socketId);
                                      }}
                                    >
                                      Отключить пользователя
                                    </Menu.Item>
                                  )}
                                </Menu.Dropdown>
                              </Menu>
                            );
                          }
                        )
                      )}
                  </Stack>
                </React.Fragment>
              )
            )}
          </Stack>
        </Collapse>
      </Stack>
      {currentServerId && (
        <CreateChannelModal
          opened={channelModalOpened}
          onClose={closeChannelModal}
          isEdit={isEditing}
          serverId={currentServerId}
          channelType={ChannelType.VOICE_CHANNEL}
        />
      )}
    </>
  );
}

export default VoiceChannels;
