import { NavLink, Stack } from '@mantine/core';
import { BookUser, ChevronRight, Settings } from 'lucide-react';

export const ProfileThreadsPanel = ({
  activeLink,
  setActiveLink,
}: {
  activeLink: 'friends' | 'settings';
  setActiveLink: React.Dispatch<React.SetStateAction<'friends' | 'settings'>>;
}) => {
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
        label="Друзья"
        leftSection={<BookUser size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'friends'}
        onClick={() => setActiveLink('friends')}
      />
      <NavLink
        label="Настройки"
        leftSection={<Settings size={16} />}
        rightSection={<ChevronRight size={12} />}
        active={activeLink === 'settings'}
        onClick={() => setActiveLink('settings')}
      />
    </Stack>
  );
};
