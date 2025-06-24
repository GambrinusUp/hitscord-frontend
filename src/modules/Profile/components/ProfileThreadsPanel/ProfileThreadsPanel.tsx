import { NavLink, Stack } from '@mantine/core';
import { BookUser, ChevronRight, MessagesSquare, Settings } from 'lucide-react';

import { useAppDispatch } from '~/hooks';
import { setActiveChat } from '~/store/ChatsStore';

export const ProfileThreadsPanel = ({
  activeLink,
  setActiveLink,
}: {
  activeLink: 'friends' | 'settings' | 'chats';
  setActiveLink: React.Dispatch<
    React.SetStateAction<'friends' | 'settings' | 'chats'>
  >;
}) => {
  const dispatch = useAppDispatch();

  return (
    <Stack
      gap="xs"
      bg="#1A1B1E"
      w={{ base: 150, lg: 250 }}
      h="100%"
      visibleFrom="sm"
      p={10}
    >
      <NavLink
        label="Чаты"
        leftSection={<MessagesSquare size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'chats'}
        onClick={() => {
          setActiveLink('chats');
          dispatch(setActiveChat(null));
        }}
      />
      <NavLink
        label="Друзья"
        leftSection={<BookUser size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'friends'}
        onClick={() => {
          setActiveLink('friends');
          dispatch(setActiveChat(null));
        }}
      />
      <NavLink
        label="Настройки"
        leftSection={<Settings size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'settings'}
        onClick={() => {
          setActiveLink('settings');
          dispatch(setActiveChat(null));
        }}
      />
    </Stack>
  );
};
