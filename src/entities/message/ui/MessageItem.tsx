import { Avatar, Box, Flex, Group, Text, Textarea } from '@mantine/core';
import { saveAs } from 'file-saver';
import { useMemo, useState } from 'react';

import { messageItemStyles } from './MessageItem.style';

/* Добавть index */
import { MessageFile } from '~/entities/chat';
import { getFile } from '~/entities/files';
import { formatFileSize } from '~/entities/message/lib/formatFileSize';
import { formatMessage } from '~/entities/message/lib/formatMessage';
import { getFileIcon } from '~/entities/message/lib/getFileIcon';
import { useMessageAuthor } from '~/entities/message/lib/useMessageAuthor';
import { MessageItemProps } from '~/entities/message/model/types';
import { formatDateTime } from '~/helpers';
import { useNotification } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';

// Обернуть в memo
export const MessageItem = ({
  type,
  isOwnMessage,
  content,
  time,
  modifiedAt,
  authorId,
  channelId,
  files,
  EditActions,
  DeleteActions,
}: MessageItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { getUsername, getUserIcon } = useMessageAuthor(type);
  const { showError } = useNotification();

  const userName = useMemo(
    () => getUsername(authorId),
    [getUsername, authorId],
  );
  const userIcon = useMemo(
    () => getUserIcon(authorId),
    [getUserIcon, authorId],
  );

  const { iconBase64 } = useIcon(userIcon);

  const handleFileClick = async (file: MessageFile) => {
    try {
      const response = await getFile(channelId, file.fileId);

      if (!response.base64File) {
        console.error('Файл пустой или не содержит base64');

        return;
      }

      const byteCharacters = atob(response.base64File);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: response.fileType });

      saveAs(blob, response.fileName);
    } catch (error) {
      showError(`Ошибка загрузки файла: ${error}`);
    }
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
        <Avatar size="md" color="blue" src={iconBase64}>
          {userName ? userName[0] : '?'}
        </Avatar>
        <Box style={messageItemStyles.box(isOwnMessage, isEditing)}>
          <Text fw={500} style={messageItemStyles.breakText()}>
            {userName}
          </Text>
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.currentTarget.value)}
              autosize
              minRows={1}
              style={messageItemStyles.textarea()}
            />
          ) : (
            <Text
              style={messageItemStyles.breakText()}
              dangerouslySetInnerHTML={{
                __html: formatMessage(content),
              }}
            />
          )}
          {files && (
            <Flex direction="column" gap={6} mt={8}>
              {files.map((file) => (
                <Group
                  key={file.fileId}
                  gap="xs"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '4px 8px',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleFileClick(file)}
                >
                  {getFileIcon(file.fileType)}
                  <Text size="sm" style={{ wordBreak: 'break-word' }}>
                    {file.fileName}
                  </Text>
                  <Text size="xs" c="gray.4">
                    {formatFileSize(file.fileSize)}
                  </Text>
                </Group>
              ))}
            </Flex>
          )}
          <Group justify="space-between">
            <Text style={messageItemStyles.meta(isOwnMessage)}>
              {formatDateTime(time)}
              {modifiedAt && (
                <span style={{ marginLeft: '8px', fontStyle: 'italic' }}>
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
          {isEditing && EditActions && (
            <EditActions
              editedContent={editedContent}
              setIsEditing={setIsEditing}
            />
          )}
          {!isEditing && DeleteActions && (
            <DeleteActions setIsEditing={setIsEditing} />
          )}
        </Group>
      )}
    </Flex>
  );
};
