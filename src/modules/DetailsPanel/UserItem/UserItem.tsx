import type { UserOnServer } from '~/store/ServerStore';

import {
  Avatar,
  Badge,
  Group,
  Popover,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useMemo, useState } from 'react';

import { useUserServer } from './lib/useUserServer';
import { userItemStyles } from './UserItem.style';

import { UserMiniProfile } from '~/components/UserMiniProfile';
import { useIcon, useRoleColor } from '~/shared/lib/hooks';

interface UserItemProps {
  user: UserOnServer;
}

export const UserItem = ({ user }: UserItemProps) => {
  const { getRoleColor } = useRoleColor();
  const { getUserIcon } = useUserServer();
  const { userName, roles, userId } = user;

  const userIcon = useMemo(() => getUserIcon(userId), [getUserIcon, userId]);

  const { iconBase64 } = useIcon(userIcon);

  const [opened, setOpened] = useState(false);

  const role = roles[0];

  return (
    <Popover opened={opened} onChange={setOpened} position="left" radius="md">
      <Popover.Target>
        <Group
          style={userItemStyles.group()}
          onClick={() => setOpened((o) => !o)}
        >
          <Avatar size="md" color="blue" src={iconBase64}>
            {userName[0]}
          </Avatar>
          <Stack>
            <Tooltip label={userName} position="top-start" withArrow>
              <Text c="white" style={userItemStyles.userName()}>
                {userName}
              </Text>
            </Tooltip>
            <Tooltip label={role.roleName} position="top" withArrow>
              <Badge
                variant="light"
                color={getRoleColor(role.roleId)}
                style={userItemStyles.badge()}
              >
                {role.roleName}
              </Badge>
            </Tooltip>
          </Stack>
        </Group>
      </Popover.Target>
      <Popover.Dropdown bg="#43474f">
        <UserMiniProfile userOnServer={user} userIcon={iconBase64} />
      </Popover.Dropdown>
    </Popover>
  );
};
