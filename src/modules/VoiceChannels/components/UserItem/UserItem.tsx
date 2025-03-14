import { Group, Menu, Slider, Text } from '@mantine/core';
import { User, Video, Volume2 } from 'lucide-react';

import { UserItemProps } from './UserItem.types';

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
}: UserItemProps) => {
  return (
    <Menu key={socketId} shadow="md" width={200} closeOnItemClick={true}>
      <Menu.Target>
        <Group style={{ cursor: 'pointer' }} wrap="nowrap">
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
            leftSection={<Video />}
            onClick={() => handleKickUser(socketId)}
          >
            Отключить пользователя
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
