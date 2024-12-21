import { Box, Flex, Text } from '@mantine/core';

const ProfileMessagesSection = () => {
  return (
    <Box
      style={{
        flex: 1,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2C2E33',
      }}
    >
      <Flex w="100%" h="100%" justify="center" align="center">
        <Text c="gray">Выберите сообщение, чтобы начать диалог</Text>
      </Flex>
    </Box>
  );
};

export default ProfileMessagesSection;
