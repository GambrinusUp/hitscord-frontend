import { useEffect, useState } from 'react';

import { socket } from '~/api';
import { useAppSelector } from '~/hooks';

export interface ActiveUser {
  producerId: string;
  volume: number;
}

export const useSpeaking = () => {
  const { currentVoiceChannelId, serverData } = useAppSelector(
    (state) => state.testServerStore,
  );

  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  const voiceChannels = serverData.channels.voiceChannels;
  const users = voiceChannels.find(
    (channel) => channel.channelId === currentVoiceChannelId,
  )?.users;

  const calculateIsSpeaking = (producerIds: string[], channelId: string) => {
    const isSpeaking =
      producerIds.some((id) =>
        activeUsers.some((user) => user.producerId === id),
      ) && channelId === currentVoiceChannelId;

    return isSpeaking;
  };

  const getIsMuted = (userId?: string) => {
    return users?.find((user) => user.userId === userId)?.isMuted;
  };

  useEffect(() => {
    if (!socket) return;
    socket.on(
      'active-speakers',
      ({ activeSpeakers }: { activeSpeakers: ActiveUser[] }) => {
        setActiveUsers(activeSpeakers);
      },
    );

    return () => {
      socket.off('active-speakers');
    };
  }, []);

  return {
    calculateIsSpeaking,
    getIsMuted,
  };
};
