import { Loader, Stack } from '@mantine/core';

import { MessageItem, MessageType } from '~/entities/message';
import { DeleteMessage, EditMessage } from '~/features/message';
import { useAppSelector } from '~/hooks';
import { LoadingState } from '~/shared';
import { useMessages } from '~/widgets/messagesList/lib/useMessages';

interface MessagesListProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  type: MessageType;
}

export const MessagesList = ({ scrollRef, type }: MessagesListProps) => {
  const { user } = useAppSelector((state) => state.userStore);

  const { messages, messagesStatus, firstMessageElementRef } = useMessages(
    scrollRef,
    type,
  );

  return (
    <Stack gap="sm">
      {messagesStatus === LoadingState.PENDING && <Loader />}
      {messages.map((message, index) => (
        <div ref={index === 0 ? firstMessageElementRef : null} key={message.id}>
          <MessageItem
            content={message.text}
            isOwnMessage={user.id === message.authorId}
            time={message.createdAt}
            modifiedAt={message.modifiedAt}
            authorId={message.authorId}
            channelId={message.channelId}
            files={message.files}
            EditActions={(props) => (
              <EditMessage {...props} type={type} messageId={message.id} />
            )}
            DeleteActions={(props) => (
              <DeleteMessage {...props} type={type} messageId={message.id} />
            )}
            type={type}
          />
        </div>
      ))}
    </Stack>
  );
};
