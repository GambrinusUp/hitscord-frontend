import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Menu,
  Notification,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { Check, Edit2, EllipsisVertical, Reply, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { MessageFiles } from './MessageFiles';
import { messageItemStyles } from './MessageItem.style';

import { formatMessage } from '~/entities/message/lib/formatMessage';
import { useMessageAuthor } from '~/entities/message/lib/useMessageAuthor';
import { MessageItemProps, MessageType } from '~/entities/message/model/types';
import { formatDateTime } from '~/helpers';
import { useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';
import { useWebSocket } from '~/shared/lib/websocket';

export const MessageItem = ({
  id,
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
  //EditActions,
  //DeleteActions,
}: MessageItemProps) => {
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentChannelId } = useAppSelector((state) => state.testServerStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { getUsername, getUserIcon } = useMessageAuthor(type);
  const { deleteMessage, deleteChatMessage, editMessage, editChatMessage } =
    useWebSocket();

  const userName = useMemo(
    () => getUsername(authorId),
    [getUsername, authorId],
  );
  const userIcon = useMemo(
    () => getUserIcon(authorId),
    [getUserIcon, authorId],
  );

  const { iconBase64 } = useIcon(userIcon);

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleEditMessage = () => {
    if (!editedContent.trim()) {
      return;
    }

    switch (type) {
      case MessageType.CHANNEL:
        editMessage({
          Token: accessToken,
          ChannelId: currentChannelId!,
          MessageId: id,
          Text: editedContent.trim(),
        });
        break;
      case MessageType.CHAT:
        editChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: id,
          Text: editedContent.trim(),
        });
        break;
    }

    setIsEditing(false);
  };

  const handleDelete = () => {
    switch (type) {
      case MessageType.CHANNEL:
        deleteMessage({
          Token: accessToken,
          ChannelId: currentChannelId!,
          MessageId: id,
        });
        break;
      case MessageType.CHAT:
        deleteChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: id,
        });
        break;
    }
  };

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
            <Menu.Item leftSection={<Edit2 size={12} />} onClick={handleEdit}>
              Редактировать
            </Menu.Item>
            <Menu.Item
              leftSection={<Trash2 size={12} />}
              onClick={handleDelete}
            >
              Удалить
            </Menu.Item>
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
            {isEditing ? (
              <Stack gap="xs">
                <Textarea
                  radius="md"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.currentTarget.value)}
                  autosize
                  minRows={1}
                  style={messageItemStyles.textarea()}
                />
                <Group gap="xs" justify="flex-end">
                  <ActionIcon
                    variant="filled"
                    color="green"
                    onClick={handleEditMessage}
                  >
                    <Check size={12} />
                  </ActionIcon>
                  <ActionIcon
                    variant="filled"
                    color="red"
                    onClick={() => setIsEditing(false)}
                  >
                    <X size={12} />
                  </ActionIcon>
                </Group>
              </Stack>
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
