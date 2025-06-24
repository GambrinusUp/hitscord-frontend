import {
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Group,
  Text,
  Textarea,
} from '@mantine/core';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { MessageItemProps } from './MessageItem.types';

import { formatDateTime } from '~/helpers';
import { useAppSelector } from '~/hooks';

export const MessageItem = ({
  isOwnMessage,
  content,
  time,
  messageId,
  modifiedAt,
  authorId,
  editMessage,
  deleteMessage,
}: MessageItemProps) => {
  const { accessToken } = useAppSelector((state) => state.userStore);
  const usersOnServer = useAppSelector(
    (state) => state.testServerStore.serverData.users,
  );
  const userName = usersOnServer.find(
    (user) => user.userId === authorId,
  )?.userName;
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    if (editedContent.trim()) {
      /*dispatch(
        editMessage({ accessToken, messageId, text: editedContent.trim() }),
      );*/
      editMessage({
        Token: accessToken,
        MessageId: messageId,
        Text: editedContent.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    //dispatch(deleteMessage({ accessToken, messageId }));
    deleteMessage({
      Token: accessToken,
      MessageId: messageId,
    });
  };

  const formatMessage = (text: string): string => {
    text = text.replace(
      /\/\/\{usertag:([a-zA-Zа-яА-ЯёЁ0-9_#]+)\}\/\//g,
      '<span style="background-color: rgba(74, 144, 226, 0.3); color: #ffffff; font-weight: 500;">@$1</span>',
    );

    text = text.replace(
      /\/\/\{roletag:([a-zA-Zа-яА-ЯёЁ0-9_-]+)\}\/\//g,
      '<span style="background-color:  rgba(74, 144, 226, 0.3); color: #ffffff; font-weight: 500;">@$1</span>',
    );

    return text;
  };

  return (
    <Flex
      direction="column"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Group
        align="flex-start"
        style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
        gap="xs"
      >
        <Avatar size="md" color="blue">
          {userName ? userName[0] : '?'}
        </Avatar>
        <Box
          style={{
            position: 'relative',
            backgroundColor: isOwnMessage ? '#4A90E2' : '#36393F',
            color: isOwnMessage ? 'white' : 'gray',
            padding: '8px 12px',
            borderRadius: '10px',
            maxWidth: '75%',
            display: 'flex',
            flexDirection: 'column',
            width: isEditing ? '100%' : 'auto',
          }}
        >
          <Text
            fw={500}
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {userName}
          </Text>
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.currentTarget.value)}
              autosize
              minRows={1}
              style={{
                marginBottom: '4px',
                width: '100%',
                flexGrow: 1,
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <Text
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
              dangerouslySetInnerHTML={{
                __html: formatMessage(content),
              }}
            />
          )}
          <Group justify="space-between">
            <Text
              style={{
                marginTop: '4px',
                fontSize: '12px',
                color: isOwnMessage ? '#D1D5DB' : '#9CA3AF',
                alignSelf: 'flex-start',
              }}
            >
              {formatDateTime(time)}
              {modifiedAt && (
                <span style={{ marginLeft: '8px', fontStyle: 'italic' }}>
                  {/*  (Отредактировано: {formatDateTime(modifiedAt)})*/}
                  Изменено
                </span>
              )}
            </Text>
          </Group>
        </Box>
      </Group>
      {isOwnMessage && (
        <Group
          justify="flex-end"
          gap="xs"
          p={4}
          style={{
            opacity: isHovered || isEditing ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          mr={44}
        >
          {isEditing ? (
            <>
              <ActionIcon variant="subtle" onClick={handleEdit}>
                <Check size={12} />
              </ActionIcon>
              <ActionIcon variant="subtle" onClick={() => setIsEditing(false)}>
                <X size={12} />
              </ActionIcon>
            </>
          ) : (
            <>
              <ActionIcon variant="subtle" onClick={() => setIsEditing(true)}>
                <Edit2 size={12} />
              </ActionIcon>
              <ActionIcon variant="subtle" onClick={handleDelete}>
                <Trash2 size={12} />
              </ActionIcon>
            </>
          )}
        </Group>
      )}
    </Flex>
  );
};
