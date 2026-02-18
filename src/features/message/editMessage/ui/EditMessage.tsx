import { ActionIcon, Group, Stack, Textarea, Tooltip } from '@mantine/core';
import { Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { editMessageStyles } from './EditMessage.style';

import { MessageType } from '~/entities/message';
import { useAppSelector } from '~/hooks';
import { useWebSocket } from '~/shared/lib/websocket';

interface EditMessageProps {
  editedContent: string;
  setEditedContent: (value: React.SetStateAction<string>) => void;
  setIsEditing: (value: boolean) => void;
  originalContent: string;
  messageId: number;
  type: MessageType;
}

export const EditMessage = ({
  editedContent,
  setEditedContent,
  setIsEditing,
  originalContent,
  messageId,
  type,
}: EditMessageProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentChannelId, currentNotificationChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { currentSubChatId } = useAppSelector((state) => state.subChatStore);
  const { editMessage, editChatMessage } = useWebSocket();

  const activeChannelId = currentChannelId ?? currentNotificationChannelId;

  const trimmedText = useMemo(() => editedContent.trim(), [editedContent]);
  const trimmedOriginalText = useMemo(
    () => originalContent.trim(),
    [originalContent],
  );
  const canSave = trimmedText.length > 0 && trimmedText !== trimmedOriginalText;

  const handleEdit = () => {
    if (!canSave) {
      return;
    }

    switch (type) {
      case MessageType.CHANNEL:
        editMessage({
          Token: accessToken,
          ChannelId: activeChannelId!,
          MessageId: messageId,
          Text: trimmedText,
        });
        break;
      case MessageType.CHAT:
        editChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: messageId,
          Text: trimmedText,
        });
        break;
      case MessageType.SUBCHAT:
        editMessage({
          Token: accessToken,
          ChannelId: currentSubChatId!,
          MessageId: messageId,
          Text: trimmedText,
        });
        break;
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(originalContent);
    setIsEditing(false);
  };

  const handleChangeMessage = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditedContent(event.currentTarget.value);
  };

  return (
    <Stack gap="xs" style={editMessageStyles.container(isFocused)}>
      <Textarea
        radius="md"
        value={editedContent}
        onChange={handleChangeMessage}
        autosize
        minRows={1}
        maxRows={10}
        placeholder="Редактировать сообщение..."
        style={editMessageStyles.textareaRoot()}
        styles={{ input: editMessageStyles.textareaInput(isFocused) }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            handleCancelEdit();

            return;
          }

          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleEdit();
          }
        }}
      />
      <Group
        gap="xs"
        justify="flex-end"
        style={editMessageStyles.buttonGroup()}
      >
        <Tooltip
          label={canSave ? 'Сохранить (Ctrl+Enter)' : 'Нет изменений'}
          withArrow
        >
          <span style={{ display: 'inline-flex' }}>
            <ActionIcon
              variant="light"
              color="green"
              onClick={handleEdit}
              size="lg"
              disabled={!canSave}
              style={editMessageStyles.actionIcon()}
              aria-label="Сохранить изменения"
            >
              <Check size={16} />
            </ActionIcon>
          </span>
        </Tooltip>
        <Tooltip label="Отмена (Esc)" withArrow>
          <ActionIcon
            variant="light"
            color="red"
            onClick={handleCancelEdit}
            size="lg"
            style={editMessageStyles.actionIcon()}
            aria-label="Отменить редактирование"
          >
            <X size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Stack>
  );
};
