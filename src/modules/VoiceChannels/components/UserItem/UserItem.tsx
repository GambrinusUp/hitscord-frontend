import { Group, Menu, Slider, Text } from '@mantine/core';
import { MicOff, Unplug, User, Video, Volume2 } from 'lucide-react';

import { UserItemProps } from './UserItem.types';

import { useAppSelector } from '~/hooks';

export const UserItem = ({
  socketId,
  isSpeaking,
  userName,
  producerIds,
  isAdmin,
  userVolume,
  handleVolumeChange,
  handleOpenStream,
  handleKickUser,
  channelId,
  userId,
}: UserItemProps) => {
  const { voiceChannels } = useAppSelector(
    (state) => state.testServerStore.serverData.channels,
  );
  const users = voiceChannels.find(
    (channel) => channel.channelId === channelId,
  )?.users;

  const isMuted = users?.find((user) => user.userId === userId)?.isMuted;

  return (
    <Menu key={socketId} shadow="md" width={200} closeOnItemClick={true}>
      <Menu.Target>
        <Group
          style={{ cursor: 'pointer', overflow: 'hidden', width: '100%' }}
          wrap="nowrap"
        >
          <User
            color={isSpeaking ? '#43b581' : undefined}
            style={{ flexShrink: 0 }}
          />
          {isMuted && <MicOff size={20} style={{ flexShrink: 0 }} />}
          <Text
            style={{
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              lineHeight: '1.2em',
              maxHeight: '2.4em',
              wordBreak: 'break-word',
            }}
          >
            {userName}
          </Text>
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
            value={userVolume}
            onChange={(value) => handleVolumeChange(socketId, value)}
            min={1}
            max={100}
          />
        </Menu.Item>
        {producerIds.length > 1 && (
          <Menu.Item
            leftSection={<Video />}
            onClick={() => handleOpenStream(socketId)}
          >
            Открыть стрим
          </Menu.Item>
        )}
        {isAdmin && (
          <Menu.Item
            leftSection={<Unplug />}
            onClick={() => handleKickUser(socketId)}
          >
            Отключить пользователя
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
