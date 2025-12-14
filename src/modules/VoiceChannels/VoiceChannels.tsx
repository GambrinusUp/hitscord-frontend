import { Collapse, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect } from 'react';

import { CollapseButton } from './components/CollapseButton';
import { UserItem } from './components/UserItem';
import { useActiveUsers } from './VoiceChannels.hooks';

import { socket } from '~/api/socket';
import { useMediaContext } from '~/context';
import { useAudioContext } from '~/context/AudioContext';
import { ChannelItem } from '~/entities/channels';
import { EditChannel } from '~/features/channels';
import { getUserGroups } from '~/helpers';
import {
  useAppDispatch,
  useAppSelector,
  useConnect,
  useDisconnect,
} from '~/hooks';
import { setUserStreamView, toggleUserStreamView } from '~/store/AppStore';
import { ChannelType, setCurrentVoiceChannelId } from '~/store/ServerStore';

export const VoiceChannels = () => {
  const connect = useConnect();
  const disconnect = useDisconnect();
  const { isConnected, consumers, users, setSelectedUserId } =
    useMediaContext();
  const { user, accessToken } = useAppSelector((state) => state.userStore);
  const { serverData, currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const dispatch = useAppDispatch();
  const [opened, { toggle }] = useDisclosure(true);

  const activeUsers = useActiveUsers();
  const { setVolume, userVolumes } = useAudioContext();
  const rooms = getUserGroups(users);
  const canWorkChannels = serverData.permissions.canWorkChannels;
  const canIgnoreMaxCount = serverData.permissions.canIgnoreMaxCount;

  const handleConnect = async (channelId: string, maxCount: number) => {
    const currentCount = rooms
      .filter((room) => room.roomName === channelId)
      .flatMap((room) => Object.values(room.users)).length;

    if (!canIgnoreMaxCount && currentCount >= maxCount) {
      return;
    }

    if (!isConnected) {
      dispatch(setCurrentVoiceChannelId(channelId));
      connect(channelId, user.name, user.id, serverData.serverId, accessToken);
    } else {
      if (channelId === currentVoiceChannelId) {
        dispatch(toggleUserStreamView());
      } else {
        if (currentVoiceChannelId) {
          await disconnect(accessToken, currentVoiceChannelId);
        }
        dispatch(setUserStreamView(false));
        dispatch(setCurrentVoiceChannelId(channelId));
        connect(
          channelId,
          user.name,
          user.id,
          serverData.serverId,
          accessToken,
        );
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
      setVolume(audioProducerId, value);
    }
  };

  const handleKickUser = (socketId: string) => {
    //console.log(socketId);
    socket.emit(
      'kickUser',
      { targetSocketId: socketId },
      // eslint-disable-next-line unused-imports/no-unused-vars
      (response: { success: boolean; message: string }) => {
        /*if (response.success) {
          console.log('Пользователь успешно кикнут:', response.message);
        } else {
          console.error('Ошибка кикания пользователя:', response.message);
        }*/
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

  const handleMuteUser = (userId: string, isMuted: boolean | undefined) => {
    if (!isMuted || isMuted === undefined) {
      //console.log(userId, isMuted, socket);
      socket.emit('muteUserById', { userId });
    } else {
      socket.emit('unmuteUserById', { userId });
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('kickedUser', () => {
      disconnect(accessToken, currentVoiceChannelId!);
      dispatch(setUserStreamView(false));
      dispatch(setCurrentVoiceChannelId(null));
    });

    return () => {
      socket.off('producerClosed');
    };
  }, [disconnect, dispatch]);

  return (
    <Stack align="flex-start" gap="xs">
      <CollapseButton
        opened={opened}
        toggle={toggle}
        canWorkChannels={canWorkChannels}
      />
      <Collapse in={opened} w="100%">
        <Stack gap="xs">
          {serverData.channels.voiceChannels.map(
            ({ channelId, channelName, maxCount }) => (
              <React.Fragment key={channelId}>
                <ChannelItem
                  key={channelId}
                  channelId={channelId}
                  channelName={channelName}
                  openChannel={() => handleConnect(channelId, maxCount)}
                  editAction={
                    <EditChannel
                      channelName={channelName}
                      channelId={channelId}
                      channelType={ChannelType.VOICE_CHANNEL}
                    />
                  }
                  maxCount={maxCount}
                  currentCount={
                    rooms
                      .filter((room) => room.roomName === channelId)
                      .flatMap((room) => Object.values(room.users)).length
                  }
                  channelType={ChannelType.VOICE_CHANNEL}
                />
                <Stack gap="xs">
                  {rooms
                    .filter((room) => room.roomName === channelId)
                    .flatMap((room) =>
                      Object.entries(room.users).map(
                        ([socketId, { producerIds, userName, userId }]) => {
                          const isSpeaking = calculateIsSpeaking(
                            producerIds,
                            channelId,
                          );

                          const userVolume = calculateSliderValue(producerIds);

                          return (
                            <UserItem
                              key={socketId}
                              socketId={socketId}
                              isSpeaking={isSpeaking}
                              userName={userName}
                              producerIds={producerIds}
                              userVolume={userVolume}
                              handleOpenStream={handleOpenStream}
                              handleVolumeChange={handleVolumeChange}
                              handleKickUser={handleKickUser}
                              channelId={channelId}
                              userId={userId}
                              handleMuteUser={handleMuteUser}
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
  );
};
