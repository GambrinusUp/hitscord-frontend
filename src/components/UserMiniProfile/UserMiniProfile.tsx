import {
  ActionIcon,
  Avatar,
  Badge,
  CopyButton,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { Check, Copy } from 'lucide-react';

import { useAppSelector } from '~/hooks';
import { UserOnServer } from '~/store/ServerStore';

export const UserMiniProfile = ({
  userName,
  userTag,
  roleName,
}: UserOnServer) => {
  const { roles } = useAppSelector((state) => state.testServerStore.serverData);
  const badgeColor =
    roles.find((role) => role.name === roleName)?.color ?? 'green';

  return (
    <Stack gap="xs" justify="center" align="center" w="100%">
      <Avatar size="md" color="blue">
        {userName[0]}
      </Avatar>
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
          cursor: 'default',
        }}
      >
        {userName}
      </Text>
      <Badge
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
      <Group>
        <Text
          c="dimmed"
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
            cursor: 'default',
          }}
        >
          {userTag}
        </Text>
        <CopyButton value={userTag} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? 'Скопировано' : 'Скопировать'}
              withArrow
              position="right"
            >
              <ActionIcon
                color={copied ? 'teal' : 'gray'}
                variant="subtle"
                onClick={copy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
    </Stack>
  );
};
