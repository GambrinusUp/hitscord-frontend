import { ActionIcon } from '@mantine/core';
import { Edit2, Trash2 } from 'lucide-react';

import { MessageType } from '~/entities/message';
import { useAppSelector } from '~/hooks';
import { useWebSocket } from '~/shared/lib/websocket';

interface DeleteMessageProps {
  setIsEditing: (value: boolean) => void;
  messageId: number;
  type: MessageType;
}

export const DeleteMessage = ({
  setIsEditing,
  messageId,
  type,
}: DeleteMessageProps) => {
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentChannelId } = useAppSelector((state) => state.testServerStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { deleteMessage, deleteChatMessage } = useWebSocket();

  const handleDelete = () => {
    switch (type) {
      case MessageType.CHANNEL:
        deleteMessage({
          Token: accessToken,
          ChannelId: currentChannelId!,
          MessageId: messageId,
        });
        break;
      case MessageType.CHAT:
        deleteChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: messageId,
        });
        break;
    }
  };

  return (
    <>
      <ActionIcon variant="subtle" onClick={() => setIsEditing(true)}>
        <Edit2 size={12} />
      </ActionIcon>
      <ActionIcon variant="subtle" onClick={handleDelete}>
        <Trash2 size={12} />
      </ActionIcon>
    </>
  );
};
