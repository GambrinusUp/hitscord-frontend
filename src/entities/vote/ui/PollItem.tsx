import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Checkbox,
  Group,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { EllipsisVertical, Reply, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { pollItemStyles } from './PollItem.style';

import { MessageType } from '~/entities/message';
import { useMessageAuthor } from '~/entities/message/lib/useMessageAuthor';
import {
  checkUserVoted,
  checkUserVotedAll,
} from '~/entities/vote/lib/checkUserVoted';
import { getInitialData } from '~/entities/vote/lib/getInitialData';
import { useVotes } from '~/entities/vote/lib/useVotes';
import { PollItemProps, VoteVariantsForm } from '~/entities/vote/model/types';
import { formatDateTime } from '~/helpers';
import { useAppSelector } from '~/hooks';
import { useIcon } from '~/shared/lib/hooks';
import { useWebSocket } from '~/shared/lib/websocket';

export const PollItem = ({
  pollId,
  authorId,
  isOwnMessage,
  type,
  time,
  title,
  content,
  variants,
  multiple,
  deadLine,
  onReplyMessage,
}: PollItemProps) => {
  const { accessToken, user } = useAppSelector((state) => state.userStore);
  const { currentChannelId, currentNotificationChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const { getUsername, getUserIcon } = useMessageAuthor(type);
  const { getVotedUsers } = useVotes();
  const { vote, unVote, deleteMessage, deleteChatMessage } = useWebSocket();
  const [isHovered, setIsHovered] = useState(false);

  const activeChannelId = currentChannelId ?? currentNotificationChannelId;
  const userId = user.id;
  const form = useForm<VoteVariantsForm>({
    initialValues: {
      votes: getInitialData(variants, userId),
    },
  });

  const userName = useMemo(
    () => getUsername(authorId),
    [getUsername, authorId],
  );
  const userIcon = useMemo(
    () => getUserIcon(authorId),
    [getUserIcon, authorId],
  );
  const userVoted = checkUserVotedAll(variants, userId);
  const deadlinePassed = deadLine && new Date(deadLine).getTime() < Date.now();
  const { iconBase64 } = useIcon(userIcon);

  const handleVote = (index: number, variantId: string) => {
    const fieldName = `votes.${index}.checked`;
    const currentValue = form.getInputProps(fieldName).value;
    const newValue = !currentValue;

    if (newValue) {
      vote({
        Token: accessToken,
        VoteVariantId: variantId,
        isChannel: type === MessageType.CHANNEL ? true : false,
      });
    } else {
      unVote({
        Token: accessToken,
        VoteVariantId: variantId,
        isChannel: type === MessageType.CHANNEL ? true : false,
      });
    }

    form.setFieldValue(fieldName, newValue);
  };

  const handleDelete = () => {
    switch (type) {
      case MessageType.CHANNEL:
        deleteMessage({
          Token: accessToken,
          ChannelId: activeChannelId!,
          MessageId: pollId,
        });
        break;
      case MessageType.CHAT:
        deleteChatMessage({
          Token: accessToken,
          ChannelId: activeChat!,
          MessageId: pollId,
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
          opacity: isHovered ? 1 : 0,
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
          w="100%"
        >
          <Group
            gap="xs"
            style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
          >
            <Text fw={500} style={pollItemStyles.breakText()}>
              {userName}
            </Text>
            <Text size="xs">{formatDateTime(time)}</Text>
          </Group>

          <Card style={pollItemStyles.card()} px="xl" miw={200}>
            <Stack gap="md">
              <Text size="lg" fw={700} c="white">
                {title}
              </Text>
              {content && <Text c="gray.4">{content}</Text>}
              {deadLine && !deadlinePassed && (
                <Text size="xs" c="gray.5">
                  Голосование до {formatDateTime(deadLine)}
                </Text>
              )}
              {deadlinePassed && (
                <Text size="xs" c="red.4">
                  Голосование завершено ({formatDateTime(deadLine)})
                </Text>
              )}
              {variants.map((variant, index) => {
                const userVote = checkUserVoted(variant, userId);
                const usersVotedPercent = getVotedUsers(variant.votedUserIds);
                const disabled =
                  deadlinePassed || (!multiple && userVoted && !userVote);

                return (
                  <Box
                    key={variant.id}
                    style={pollItemStyles.box(disabled)}
                    onClick={() => !disabled && handleVote(index, variant.id)}
                  >
                    {userVoted && (
                      <Box style={pollItemStyles.vote(usersVotedPercent)} />
                    )}

                    <Group
                      justify="space-between"
                      align="center"
                      px="md"
                      py={8}
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      <Group gap="xs">
                        <Checkbox
                          {...form.getInputProps(`votes.${index}.checked`, {
                            type: 'checkbox',
                          })}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleVote(index, variant.id)}
                          styles={{
                            input: {
                              cursor: disabled ? 'not-allowed' : 'pointer',
                            },
                          }}
                          disabled={disabled}
                          radius="xl"
                        />
                        <Text
                          c={
                            disabled ? 'gray.5' : userVote ? 'white' : 'gray.2'
                          }
                          style={{
                            transition: 'color 0.2s',
                          }}
                        >
                          {variant.content}
                        </Text>
                      </Group>

                      {userVoted && (
                        <Text size="xs" c="gray.4">
                          {usersVotedPercent}%
                        </Text>
                      )}
                    </Group>
                  </Box>
                );
              })}
            </Stack>
          </Card>

          {userVoted && (
            <Text size="xs" c="gray.5" ta="center">
              Всего проголосовавших:{' '}
              {variants.reduce((acc, v) => acc + v.votedUserIds.length, 0)}
            </Text>
          )}
        </Stack>
      </Group>
    </Group>
  );
};
