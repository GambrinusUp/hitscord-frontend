import { Divider, Stack, Text } from '@mantine/core';
import { useState } from 'react';

import ThreadItem from './ThreadItem';

interface Thread {
  id: string;
  name: string;
  lastMessage: string;
  date: string;
}

const threads: Thread[] = [
  { id: '1', name: 'Сообщений', lastMessage: 'пока нет(', date: '14.12.2024' },
];

const ProfileThreadsPanel = () => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  return (
    <Stack
      gap="xs"
      bg="#1A1B1E"
      w={{ base: 150, lg: 250 }}
      h="100%"
      visibleFrom="sm"
      p={10}
    >
      <Text>Сообщения</Text>
      <Divider />
      <Stack gap="xs">
        {threads.map((thread) => (
          <ThreadItem
            key={thread.id}
            name={thread.name}
            lastMessage={thread.lastMessage}
            date={thread.date}
            isActive={activeThreadId === thread.id}
            onClick={() => setActiveThreadId(thread.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default ProfileThreadsPanel;
