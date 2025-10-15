import { ActionIcon } from '@mantine/core';
import { Check, X } from 'lucide-react';

import { MessageType } from '~/entities/message';
import { useAppSelector } from '~/hooks';
import { useWebSocket } from '~/shared/lib/websocket';

interface EditMessageProps {
  editedContent: string;
  setIsEditing: (value: boolean) => void;
  messageId: number;
  type: MessageType;
}

export const EditMessage = ({
  editedContent,
  setIsEditing,
  messageId,
  type,
}: EditMessageProps) => {
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentChannelId } = useAppSelector((state) => state.testServerStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { editMessage, editChatMessage } = useWebSocket();

  const handleEdit = () => {
    if (!editedContent.trim()) {
      return;
    }

    switch (type) {
      case MessageType.CHANNEL:
        editMessage({
          Token: accessToken,
          ChannelId: currentChannelId!,
          MessageId: messageId,
          Text: editedContent.trim(),
        });
        break;
      case MessageType.CHAT:
        editChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: messageId,
          Text: editedContent.trim(),
        });
        break;
    }

    setIsEditing(false);
  };

  return (
    <>
      <ActionIcon variant="subtle" onClick={handleEdit}>
        <Check size={12} />
      </ActionIcon>
      <ActionIcon variant="subtle" onClick={() => setIsEditing(false)}>
        <X size={12} />
      </ActionIcon>
    </>
  );
};
