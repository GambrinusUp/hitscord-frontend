import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useAppSelector } from '../../hooks/redux';
import ChatSection from '../../modules/ChatSection/ChatSection';
import ChatSectionWithUsers from '../../modules/ChatSectionWithUsers/ChatSectionWithUsers';
import DetailsPanel from '../../modules/DetailsPanel/DetailsPanel';
import DetailsPanelMobile from '../../modules/DetailsPanel/DetailsPanelMobile/DetailsPanelMobile';
import ServerPanel from '../../modules/ServerPanel/ServerPanel';
import SideBarMobile from '../../modules/SideBar/Components/SideBarMobile/SideBarMobile';
import SideBar from '../../modules/SideBar/SideBar';

const TestMainPage = () => {
  const { isUserStreamView } = useAppSelector((state) => state.appStore);
  const [sidebarOpened, { open, close }] = useDisclosure(false);
  const [
    detailsPanelOpened,
    { open: openDetailsPanel, close: closeDetailsPanel },
  ] = useDisclosure(false);

  return (
    <Box style={{ display: 'flex', height: '100dvh' }}>
      <ServerPanel />
      <SideBar onClose={close} />
      {!isUserStreamView ? (
        <ChatSection openSidebar={open} openDetailsPanel={openDetailsPanel} />
      ) : (
        <ChatSectionWithUsers />
      )}
      <DetailsPanel />
      <SideBarMobile onClose={close} opened={sidebarOpened} />
      <DetailsPanelMobile
        onClose={closeDetailsPanel}
        opened={detailsPanelOpened}
      />
    </Box>
  );
};

export default TestMainPage;
