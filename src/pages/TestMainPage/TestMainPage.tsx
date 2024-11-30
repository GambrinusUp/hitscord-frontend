import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useAppSelector } from '../../hooks/redux';
import { useMediasoupConnection } from '../../hooks/useMediasoupConnection';
import ChatSection from '../../modules/ChatSection/ChatSection';
import ChatSectionWithUsers from '../../modules/ChatSectionWithUsers/ChatSectionWithUsers';
import DetailsPanel from '../../modules/DetailsPanel/DetailsPanel';
import DetailsPanelMobile from '../../modules/DetailsPanel/DetailsPanelMobile/DetailsPanelMobile';
import ServerPanel from '../../modules/ServerPanel/ServerPanel';
import SideBarMobile from '../../modules/SideBar/Components/SideBarMobile/SideBarMobile';
import SideBar from '../../modules/SideBar/SideBar';

const TestMainPage = () => {
  const { isUserStreamView } = useAppSelector((state) => state.appStore);
  const { roomName, user } = useAppSelector((state) => state.userStore);
  const {
    connect,
    disconnect,
    startScreenSharing,
    stopScreenSharing,
    consumers,
    connected,
    users,
    toggleMute,
    isMuted,
    isStreaming,
    activeUsers,
  } = useMediasoupConnection(roomName, user.fullName);
  const [sidebarOpened, { open, close }] = useDisclosure(false);
  const [
    detailsPanelOpened,
    { open: openDetailsPanel, close: closeDetailsPanel },
  ] = useDisclosure(false);

  return (
    <Box style={{ display: 'flex', height: '100dvh' }}>
      <ServerPanel />
      <SideBar
        connect={connect}
        disconnect={disconnect}
        startScreenSharing={startScreenSharing}
        stopScreenSharing={stopScreenSharing}
        consumers={consumers}
        connected={connected}
        users={users}
        toggleMute={toggleMute}
        isMuted={isMuted}
        isStreaming={isStreaming}
        onClose={close}
        activeUsers={activeUsers}
      />
      {!isUserStreamView ? (
        <ChatSection openSidebar={open} openDetailsPanel={openDetailsPanel} />
      ) : (
        <ChatSectionWithUsers users={users} consumers={consumers} />
      )}
      <DetailsPanel />
      <SideBarMobile
        connect={connect}
        disconnect={disconnect}
        startScreenSharing={startScreenSharing}
        stopScreenSharing={stopScreenSharing}
        consumers={consumers}
        connected={connected}
        users={users}
        toggleMute={toggleMute}
        isMuted={isMuted}
        isStreaming={isStreaming}
        onClose={close}
        opened={sidebarOpened}
        activeUsers={activeUsers}
      />
      <DetailsPanelMobile
        onClose={closeDetailsPanel}
        opened={detailsPanelOpened}
      />
    </Box>
  );
};

export default TestMainPage;
