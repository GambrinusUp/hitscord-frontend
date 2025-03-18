import { Collapse, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react';

import { ChannelItem } from './components/ChannelItem';
import { CollapseButton } from './components/CollapseButton';
import { UserItem } from './components/UserItem';
import { useActiveUsers } from './VoiceChannels.hooks';

import { socket } from '~/api/socket';
import { CreateChannelModal } from '~/components/CreateChannelModal';
import { useMediaContext } from '~/context';
import { getUserGroups } from '~/helpers';
import {
  useAppDispatch,
  useAppSelector,
  useConnect,
  useDisconnect,
} from '~/hooks';
import { EditModal } from '~/shared/types';
import { setUserStreamView, toggleUserStreamView } from '~/store/AppStore';
import { ChannelType, setCurrentVoiceChannelId } from '~/store/ServerStore';

export const VoiceChannels = () => {
  const connect = useConnect();
  const disconnect = useDisconnect();
  const { isConnected, consumers, users, setSelectedUserId } =
    useMediaContext();
  const { user } = useAppSelector((state) => state.userStore);
  const { serverData, currentVoiceChannelId, currentServerId } = useAppSelector(
    (state) => state.testServerStore,
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
        (c) => c.producerId === producerId && c.kind === 'audio',
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
      },
    );
  };

  const calculateSliderValue = (producerIds: string[]) => {
    const audioProducerId = producerIds.find((id) =>
      consumers.some((c) => c.producerId === id && c.kind === 'audio'),
    );

    return (userVolumes[audioProducerId || ''] || 1) * 100;
  };

  const calculateIsSpeaking = (producerIds: string[], channelId: string) => {
    const isSpeaking =
      producerIds.some((id) =>
        activeUsers.some((user) => user.producerId === id),
      ) && channelId === currentVoiceChannelId;

    return isSpeaking;
  };

  const handleOpenStream = (socketId: string) => {
    setSelectedUserId(socketId);
    dispatch(setUserStreamView(true));
  };

  const handleEditChannel = (channelName: string, channelId: string) => {
    setIsEditing({
      isEdit: true,
      initialData: channelName,
      channelId: channelId,
    });
    openChannelModal();
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
        <CollapseButton
          opened={opened}
          toggle={toggle}
          isAdmin={isAdmin}
          handleAddChannel={handleAddChannel}
        />
        <Collapse in={opened} w="100%">
          <Stack gap="xs">
            {serverData.channels.voiceChannels.map(
              ({ channelId, channelName }) => (
                <React.Fragment key={channelId}>
                  <ChannelItem
                    channelId={channelId}
                    channelName={channelName}
                    isAdmin={isAdmin}
                    handleConnect={() => handleConnect(channelId)}
                    handleEditChannel={() =>
                      handleEditChannel(channelName, channelId)
                    }
                  />
                  <Stack gap="xs">
                    {rooms
                      .filter((room) => room.roomName === channelId)
                      .flatMap((room) =>
                        Object.entries(room.users).map(
                          ([socketId, { producerIds, userName }]) => {
                            const isSpeaking = calculateIsSpeaking(
                              producerIds,
                              channelId,
                            );

                            const userVolume =
                              calculateSliderValue(producerIds);

                            return (
                              <UserItem
                                key={socketId}
                                socketId={socketId}
                                isSpeaking={isSpeaking}
                                userName={userName}
                                producerIds={producerIds}
                                isAdmin={isAdmin}
                                userVolume={userVolume}
                                handleOpenStream={handleOpenStream}
                                handleVolumeChange={handleVolumeChange}
                                handleKickUser={handleKickUser}
                              />
                            );
                          },
                        ),
                      )}
                  </Stack>
                </React.Fragment>
              ),
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
};
