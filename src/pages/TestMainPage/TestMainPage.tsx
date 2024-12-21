import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import ChatSection from '../../modules/ChatSection/ChatSection';
import ChatSectionWithUsers from '../../modules/ChatSectionWithUsers/ChatSectionWithUsers';
import DetailsPanel from '../../modules/DetailsPanel/DetailsPanel';
import DetailsPanelMobile from '../../modules/DetailsPanel/DetailsPanelMobile/DetailsPanelMobile';
import Profile from '../../modules/Profile/Profile';
import ServerPanel from '../../modules/ServerPanel/ServerPanel';
import SideBarMobile from '../../modules/SideBar/Components/SideBarMobile/SideBarMobile';
import SideBar from '../../modules/SideBar/SideBar';
import { getServerData } from '../../store/server/ServerActionCreators';
import { getUserProfile } from '../../store/user/UserActionCreators';

const TestMainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUserStreamView, isOpenHome } = useAppSelector(
    (state) => state.appStore
  );
  const { accessToken, isLoggedIn } = useAppSelector(
    (state) => state.userStore
  );
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const [sidebarOpened, { open, close }] = useDisclosure(false);
  const [
    detailsPanelOpened,
    { open: openDetailsPanel, close: closeDetailsPanel },
  ] = useDisclosure(false);

  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (accessToken) dispatch(getUserProfile({ accessToken }));
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (currentServerId && accessToken)
      dispatch(getServerData({ accessToken, serverId: currentServerId }));
  }, [accessToken, currentServerId, dispatch]);

  return (
    <Box style={{ display: 'flex', height: '100dvh' }}>
      <ServerPanel />
      {isOpenHome ? (
        <Profile />
      ) : (
        <>
          <SideBar onClose={close} />
          {!isUserStreamView ? (
            <ChatSection
              openSidebar={open}
              openDetailsPanel={openDetailsPanel}
            />
          ) : (
            <ChatSectionWithUsers />
          )}
          <DetailsPanel />
          <SideBarMobile onClose={close} opened={sidebarOpened} />
          <DetailsPanelMobile
            onClose={closeDetailsPanel}
            opened={detailsPanelOpened}
          />
        </>
      )}
    </Box>
  );
};

export default TestMainPage;
