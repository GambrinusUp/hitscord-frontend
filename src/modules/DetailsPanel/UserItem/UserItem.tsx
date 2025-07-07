import type { UserOnServer } from '~/store/ServerStore';

import { Avatar, Badge, Flex, Popover, Text, Tooltip } from '@mantine/core';
import { useState } from 'react';

import { UserMiniProfile } from '~/components/UserMiniProfile';
import { useAppSelector } from '~/hooks';

export const UserItem = ({
  userId,
  userName,
  userTag,
  roleName,
  roleType,
}: Omit<
  UserOnServer,
  | 'icon'
  | 'mail'
  | 'notifiable'
  | 'friendshipApplication'
  | 'nonFriendMessage'
  | 'roleId'
  | 'serverId'
>) => {
  const [opened, setOpened] = useState(false);
  const { roles } = useAppSelector((state) => state.testServerStore.serverData);
  const badgeColor =
    roles.find((role) => role.name === roleName)?.color ?? 'green';

  return (
    <Popover opened={opened} onChange={setOpened} position="left" radius="md">
      <Popover.Target>
        <Flex
          align="center"
          gap="sm"
          style={{ width: '100%', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setOpened((o) => !o)}
        >
          <Avatar size="md" color="blue">
            {userName}
          </Avatar>
          <Tooltip label={userName} position="top-start" withArrow>
            <Text
              c="white"
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
          </Tooltip>
          <Tooltip label={roleName} position="top-end" withArrow>
            <Badge
              variant="light"
              color={badgeColor}
              radius="sm"
              style={{
                maxWidth: 100,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {roleName}
            </Badge>
          </Tooltip>
        </Flex>
      </Popover.Target>
      <Popover.Dropdown bg="#43474f">
        <UserMiniProfile
          userId={userId}
          userName={userName}
          userTag={userTag}
          roleName={roleName}
          roleType={roleType}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
