import { Flex, Stack, Title, Tabs, Box, Group } from '@mantine/core';
import { useState } from 'react';

import { ApplicationFromList } from './ApplicationFromList';
import { ApplicationToList } from './ApplicationToList';
import { ChatSwitcher } from './ChatSwitcher';
import { FriendshipList } from './FriendshipList';
import { Settings } from './Settings';

import { AddFriend } from '~/features/friendship/addFriend';

interface ProfileContentProps {
  activeLink: 'friends' | 'settings' | 'chats';
}

export const ProfileContent = ({ activeLink }: ProfileContentProps) => {
  const [activeTab, setActiveTab] = useState<string | null>('friends');

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
      <Flex w="100%" h="100%" justify="center">
        {activeLink === 'chats' && <ChatSwitcher />}
        {activeLink === 'settings' && <Settings />}
        {activeLink === 'friends' && (
          <Stack gap="xs" w="100%" h="100%" p={10}>
            <Group justify="space-between" mb="md">
              <Title order={1}>Друзья</Title>
              <AddFriend />
            </Group>
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              styles={{
                tab: {
                  '--tab-hover-color': '#4f4f4f',
                },
              }}
              w="100%"
            >
              <Tabs.List>
                <Tabs.Tab value="friends">Ваши друзья</Tabs.Tab>
                <Tabs.Tab value="applicationFrom">Исходящие заявки</Tabs.Tab>
                <Tabs.Tab value="applicationTo">Входящие заявки</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="friends">
                <FriendshipList />
              </Tabs.Panel>
              <Tabs.Panel value="applicationFrom">
                <ApplicationFromList />
              </Tabs.Panel>
              <Tabs.Panel value="applicationTo">
                <ApplicationToList />
              </Tabs.Panel>
            </Tabs>
          </Stack>
        )}
      </Flex>
    </Box>
  );
};
