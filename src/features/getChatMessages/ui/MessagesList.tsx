import { Loader, Stack } from '@mantine/core';

import { MessageItem } from '~/components/MessageItem';
import { useChatMessages } from '~/features/getChatMessages/lib/hooks/useChatMessages';
import { useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { useWebSocket } from '~/shared/lib/websocket';

interface MessagesListProps {
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const MessagesList = ({ scrollRef }: MessagesListProps) => {
  const { user } = useAppSelector((state) => state.userStore);
  const { editChatMessage, deleteChatMessage } = useWebSocket();

  const { messages, messagesStatus, firstMessageElementRef } =
    useChatMessages(scrollRef);

  return (
    <Stack gap="sm">
      {messagesStatus === LoadingState.PENDING && <Loader />}
      {messages.map((message, index) => (
        <div ref={index === 0 ? firstMessageElementRef : null} key={message.id}>
          <MessageItem
            messageId={message.id}
            content={message.text}
            isOwnMessage={user.id === message.authorId}
            time={message.createdAt}
            modifiedAt={message.modifiedAt}
            authorId={message.authorId}
            editMessage={editChatMessage}
            deleteMessage={deleteChatMessage}
          />
        </div>
      ))}
    </Stack>
  );
};
