import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Menu,
  Notification,
  Stack,
  Text,
} from '@mantine/core';
import { EllipsisVertical, Reply } from 'lucide-react';
import { useMemo, useState } from 'react';

import { MessageFiles } from './MessageFiles';
import { messageItemStyles } from './MessageItem.style';

import { formatMessage } from '~/entities/message/lib/formatMessage';
import { useMessageAuthor } from '~/entities/message/lib/useMessageAuthor';
import { MessageItemProps } from '~/entities/message/model/types';
import { formatDateTime } from '~/helpers';
import { useIcon } from '~/shared/lib/hooks';

export const MessageItem = ({
  type,
  isOwnMessage,
  content,
  replyMessage,
  time,
  modifiedAt,
  authorId,
  channelId,
  files,
  onReplyMessage,
  EditMessage,
  MessageActions,
}: MessageItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { getUsername, getUserIcon } = useMessageAuthor(type);

  const userName = useMemo(
    () => getUsername(authorId),
    [getUsername, authorId],
  );
  const userIcon = useMemo(
    () => getUserIcon(authorId),
    [getUserIcon, authorId],
  );

  const { iconBase64 } = useIcon(userIcon);

  return (
    <Group
      justify="space-between"
      align="flex-start"
      style={{ flexDirection: isOwnMessage ? 'row' : 'row-reverse' }}
      grow
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Group
        gap="xs"
        justify={isOwnMessage ? 'flex-start' : 'flex-end'}
        style={{
          opacity: isHovered || isEditing ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <ActionIcon
          variant="subtle"
          aria-label="reply"
          onClick={onReplyMessage}
        >
          <Reply size={20} />
        </ActionIcon>
        <Menu position="bottom-start" shadow="md" width={150} offset={-30}>
          <Menu.Target>
            <ActionIcon variant="subtle" aria-label="edit" onClick={() => {}}>
              <EllipsisVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {MessageActions && (
              <MessageActions
                setIsEditing={setIsEditing}
                setEditedContent={setEditedContent}
                messageContent={content}
              />
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Group
        flex={1}
        align="flex-start"
        style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
        gap="xs"
      >
        <Avatar size="md" color="blue" src={iconBase64}>
          {userName ? userName[0] : '?'}
        </Avatar>
        <Stack
          gap="xs"
          align={isOwnMessage ? 'flex-end' : 'flex-start'}
          style={{ flex: 1 }}
          //w="100%"
        >
          <Group
            gap="xs"
            style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
          >
            <Text fw={500} style={messageItemStyles.breakText()}>
              {userName}
            </Text>
            <Text size="xs">{formatDateTime(time)}</Text>
            {modifiedAt && (
              <Text size="xs" fs="italic">
                (изменено)
              </Text>
            )}
          </Group>
          <Box style={messageItemStyles.box(isOwnMessage, isEditing)}>
            {replyMessage && (
              <Notification
                title={
                  <Group gap="xs">
                    <Reply size={10} />
                    <Text size="sm">{getUsername(replyMessage.authorId)}</Text>
                  </Group>
                }
                withCloseButton={false}
              >
                {replyMessage.text}
              </Notification>
            )}
            {isEditing && EditMessage ? (
              <EditMessage
                editedContent={editedContent}
                setEditedContent={setEditedContent}
                setIsEditing={setIsEditing}
              />
            ) : (
              <Text
                style={messageItemStyles.breakText()}
                dangerouslySetInnerHTML={{
                  __html: formatMessage(content),
                }}
              />
            )}
            {files && files.length > 0 && (
              <MessageFiles files={files} channelId={channelId} />
            )}
          </Box>
        </Stack>
      </Group>
    </Group>
  );
};
