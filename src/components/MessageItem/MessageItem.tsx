import { ActionIcon, Avatar, Box, Group, Text, Textarea } from '@mantine/core';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { formatDateTime } from '../../helpers/formatDateTime';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  deleteMessage,
  editMessage,
} from '../../store/server/ServerActionCreators';

interface MessageItemProps {
  isOwnMessage: boolean;
  userName: string;
  content: string;
  time: string;
  messageId: string;
  modifiedAt?: string | null;
}

const MessageItem = ({
  isOwnMessage,
  userName,
  content,
  time,
  messageId,
  modifiedAt,
}: MessageItemProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    if (editedContent.trim()) {
      dispatch(
        editMessage({ accessToken, messageId, text: editedContent.trim() })
      );
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    dispatch(deleteMessage({ accessToken, messageId }));
  };

  return (
    <Group
      align="flex-start"
      style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
      gap="xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar size="md" color="blue">
        {userName[0]}
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
          >
            {content}
          </Text>
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
          {isOwnMessage && (isHovered || isEditing) && (
            <Group justify="flex-end" gap="xs" p={4}>
              {isEditing ? (
                <>
                  <ActionIcon color="green" onClick={handleEdit}>
                    <Check size={16} />
                  </ActionIcon>
                  <ActionIcon color="red" onClick={() => setIsEditing(false)}>
                    <X size={16} />
                  </ActionIcon>
                </>
              ) : (
                <>
                  <ActionIcon color="blue" onClick={() => setIsEditing(true)}>
                    <Edit2 size={16} />
                  </ActionIcon>
                  <ActionIcon color="red" onClick={handleDelete}>
                    <Trash2 size={16} />
                  </ActionIcon>
                </>
              )}
            </Group>
          )}
        </Group>
      </Box>
    </Group>
  );
};

export default MessageItem;
