import { ProfileMessagesSection } from './components/ProfileMessagesSection';
import { ProfileSideBar } from './components/ProfileSideBar';
import { ProfileThreadsPanel } from './components/ProfileThreadsPanel';

export const Profile = () => {
  return (
    <>
      {/*<Stack
        gap="xs"
        bg="#1A1B1E"
        p={10}
        w={{ base: 150, lg: 250 }}
        h="100%"
        visibleFrom="sm"
      >
        {threads.map((thread) => (
          <Box
            key={thread.id}
            p="sm"
            onClick={() => alert(`Thread ${thread.name} clicked!`)}
          >
            <Text fw="bold">{thread.name}</Text>
            <Text size="sm" c="gray">
              {thread.lastMessage}
            </Text>
          </Box>
        ))}
      </Stack>*/}
      <ProfileThreadsPanel />
      <ProfileMessagesSection />
      <ProfileSideBar />
    </>
  );
};
