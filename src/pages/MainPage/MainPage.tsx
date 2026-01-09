import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { getUserProfile } from '~/entities/user';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ChatSection } from '~/modules/ChatSection/ChatSection';
import { DetailsPanel, DetailsPanelMobile } from '~/modules/DetailsPanel';
import { ProfilePage } from '~/modules/Profile';
import { ServerPanel } from '~/modules/ServerPanel';
import { SideBar, SideBarMobile } from '~/modules/SideBar';
import { getChannelMessages, getServerData } from '~/store/ServerStore';
import { VoiceChannelFacade } from '~/widgets/voiceChannelFacade';

export const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUserStreamView, isOpenHome } = useAppSelector(
    (state) => state.appStore,
  );
  const { accessToken, isLoggedIn } = useAppSelector(
    (state) => state.userStore,
  );
  const {
    currentServerId,
    currentChannelId,
    currentNotificationChannelId,
    startMessageId,
  } = useAppSelector((state) => state.testServerStore);
  const [sidebarOpened, { open, close }] = useDisclosure(false);
  const [
    detailsPanelOpened,
    { open: openDetailsPanel, close: closeDetailsPanel },
  ] = useDisclosure(false);

  const activeChannelId = currentChannelId ?? currentNotificationChannelId;

  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (accessToken) dispatch(getUserProfile());
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (currentServerId && accessToken) {
      dispatch(getServerData({ accessToken, serverId: currentServerId }));
    }
  }, [accessToken, currentServerId, dispatch]);

  useEffect(() => {
    if (activeChannelId && accessToken) {
      const isFirstLoad = startMessageId === 0;

      dispatch(
        getChannelMessages({
          accessToken,
          channelId: activeChannelId,
          number: MAX_MESSAGE_NUMBER,
          fromMessageId: startMessageId,
          down: isFirstLoad,
        }),
      );
    }
  }, [accessToken, activeChannelId, dispatch]);

  return (
    <Box style={{ display: 'flex', height: '100dvh' }}>
      <ServerPanel />
      {isOpenHome ? (
        <ProfilePage />
      ) : (
        <>
          <SideBar onClose={close} />
          {!isUserStreamView ? (
            <ChatSection
              openSidebar={open}
              openDetailsPanel={openDetailsPanel}
            />
          ) : (
            <VoiceChannelFacade />
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
