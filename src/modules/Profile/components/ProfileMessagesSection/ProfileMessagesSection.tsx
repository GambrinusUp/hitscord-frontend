import { Box, Flex, Stack, Tabs, Text } from '@mantine/core';
import { useState } from 'react';

import { ProfileMessagesSectionProps } from './ProfileMessagesSection.types';

import { useAppSelector } from '~/hooks';
import {
  UserItem,
  UserType,
} from '~/modules/Profile/components/ApplicationItem';
import { Chats } from '~/modules/Profile/components/Chats';
import { Settings } from '~/modules/Profile/components/Settings';

export const ProfileMessagesSection = ({
  activeLink,
  sendChatMessage,
  editChatMessage,
  deleteChatMessage,
}: ProfileMessagesSectionProps) => {
  const [activeTab, setActiveTab] = useState<string | null>('friends');
  const { applicationFrom, applicationTo, friendshipList } = useAppSelector(
    (state) => state.userStore,
  );

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
        {activeLink === 'chats' && (
          <Chats
            sendChatMessage={sendChatMessage}
            editChatMessage={editChatMessage}
            deleteChatMessage={deleteChatMessage}
          />
        )}
        {activeLink === 'settings' && <Settings />}
        {activeLink === 'friends' && (
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
              <Stack p="xs" gap="xs">
                {friendshipList.length < 1 && (
                  <Text>У вас пока нет друзей</Text>
                )}
                {friendshipList.map((friend) => (
                  <UserItem
                    key={friend.userId}
                    type={UserType.FRIEND}
                    userName={friend.userName}
                    userTag={friend.userTag}
                    userId={friend.userId}
                  />
                ))}
              </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="applicationFrom">
              <Stack p="xs" gap="xs">
                {applicationFrom.length < 1 && <Text>Заявок нет</Text>}
                {applicationFrom.map((application) => (
                  <UserItem
                    key={application.id}
                    applicationId={application.id}
                    type={UserType.APPLICATION_FROM}
                    userName={application.user.userName}
                    userTag={application.user.userTag}
                    createdAt={application.createdAt}
                    userId={application.user.userId}
                  />
                ))}
              </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="applicationTo">
              <Stack p="xs" gap="xs">
                {applicationTo.length < 1 && <Text>Заявок нет</Text>}
                {applicationTo.map((application) => (
                  <UserItem
                    key={application.id}
                    applicationId={application.id}
                    type={UserType.APPLICATION_TO}
                    userName={application.user.userName}
                    userTag={application.user.userTag}
                    createdAt={application.createdAt}
                    userId={application.user.userId}
                  />
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        )}
      </Flex>
    </Box>
  );
};
