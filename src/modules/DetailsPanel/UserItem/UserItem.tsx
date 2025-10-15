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
import { useState } from 'react';

import { userItemStyles } from './UserItem.style';

import { UserMiniProfile } from '~/components/UserMiniProfile';

interface UserItemProps {
  user: UserOnServer;
}

export const UserItem = ({ user }: UserItemProps) => {
  //const { roles } = useAppSelector((state) => state.testServerStore.serverData);

  const [opened, setOpened] = useState(false);

  const { userName, roles } = user;

  const role = roles[0];

  return (
    <Popover opened={opened} onChange={setOpened} position="left" radius="md">
      <Popover.Target>
        <Group
          style={userItemStyles.group()}
          onClick={() => setOpened((o) => !o)}
        >
          <Avatar size="md" color="blue">
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
                //color={badgeColor}
                style={userItemStyles.badge()}
              >
                {role.roleName}
              </Badge>
            </Tooltip>
          </Stack>
        </Group>
      </Popover.Target>
      <Popover.Dropdown bg="#43474f">
        <UserMiniProfile userOnServer={user} />
      </Popover.Dropdown>
    </Popover>
  );
};
