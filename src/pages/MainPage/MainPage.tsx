import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { getUserProfile } from '~/entities/user';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ChatSection } from '~/modules/ChatSection/ChatSection';
import { ChatSectionWithUsers } from '~/modules/ChatSectionWithUsers';
import { DetailsPanel, DetailsPanelMobile } from '~/modules/DetailsPanel';
import { ProfilePage } from '~/modules/Profile';
import { ServerPanel } from '~/modules/ServerPanel';
import { SideBar, SideBarMobile } from '~/modules/SideBar';
import {
  getChannelMessages,
  getServerData,
} from '~/store/ServerStore/ServerStore.actions';

export const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  //const { showMessage } = useNotification();
  const { isUserStreamView, isOpenHome } = useAppSelector(
    (state) => state.appStore,
  );
  const { accessToken, isLoggedIn } = useAppSelector(
    (state) => state.userStore,
  );
  const { currentServerId, currentChannelId, startMessageId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const [sidebarOpened, { open, close }] = useDisclosure(false);
  const [
    detailsPanelOpened,
    { open: openDetailsPanel, close: closeDetailsPanel },
  ] = useDisclosure(false);
  /*const { sendMessage, editMessage, deleteMessage } = useWebSocketHandler({
    accessToken,
    dispatch,
    serverId: currentServerId,
    showMessage,
  });*/

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
    if (currentChannelId && accessToken) {
      console.log(MAX_MESSAGE_NUMBER, startMessageId);
      dispatch(
        getChannelMessages({
          accessToken,
          channelId: currentChannelId,
          number: MAX_MESSAGE_NUMBER,
          fromMessageId: startMessageId,
          down: false,
        }),
      );
    }
  }, [accessToken, currentChannelId, currentServerId, dispatch]);

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
