import { Avatar, Box, Group, Text } from '@mantine/core';

import { formatDateTime } from '../../helpers/formatDateTime';

const MessageItem = ({
  isOwnMessage,
  userName,
  content,
  time,
}: {
  isOwnMessage: boolean;
  userName: string;
  content: string;
  time: string;
}) => {
  return (
    <Group
      align="flex-start"
      style={{ flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}
      gap="xs"
    >
      <Avatar size="md" color="blue">
        {userName[0]}
      </Avatar>
      <Box
        style={{
          backgroundColor: isOwnMessage ? '#4A90E2' : '#36393F',
          color: isOwnMessage ? 'white' : 'gray',
          padding: '8px 12px',
          borderRadius: '10px',
          maxWidth: '75%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Text
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content}
        </Text>
        <Text
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: isOwnMessage ? '#D1D5DB' : '#9CA3AF',
            alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
          }}
        >
          {formatDateTime(time)}
        </Text>
      </Box>
    </Group>
  );
};

export default MessageItem;
