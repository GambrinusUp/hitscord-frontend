import { Avatar, Box, Group, Text } from '@mantine/core';

const Message = ({
  isOwnMessage,
  userName,
  content,
}: {
  isOwnMessage: boolean;
  userName: string;
  content: string;
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
      </Box>
    </Group>
  );
};

export default Message;
