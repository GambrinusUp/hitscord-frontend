import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApiWebSocketHandler, useWebSocketHandler } from './MainPage.hooks';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { useAppDispatch, useAppSelector, useNotification } from '~/hooks';
import { ChatSection } from '~/modules/ChatSection/ChatSection';
import { ChatSectionWithUsers } from '~/modules/ChatSectionWithUsers';
import { DetailsPanel, DetailsPanelMobile } from '~/modules/DetailsPanel';
import { Profile } from '~/modules/Profile';
import { ServerPanel } from '~/modules/ServerPanel';
import { SideBar, SideBarMobile } from '~/modules/SideBar';
import {
  getChannelMessages,
  getServerData,
} from '~/store/ServerStore/ServerStore.actions';
import { getUserProfile } from '~/store/UserStore/UserStore.actions';

export const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showMessage } = useNotification();
  const { isUserStreamView, isOpenHome } = useAppSelector(
    (state) => state.appStore,
  );
  const { accessToken, isLoggedIn } = useAppSelector(
    (state) => state.userStore,
  );
  const { currentServerId, currentChannelId, numberOfStarterMessage } =
    useAppSelector((state) => state.testServerStore);
  const [sidebarOpened, { open, close }] = useDisclosure(false);
  const [
    detailsPanelOpened,
    { open: openDetailsPanel, close: closeDetailsPanel },
  ] = useDisclosure(false);
  const {
    sendMessage,
    editMessage,
    deleteMessage,
    sendChatMessage,
    editChatMessage,
    deleteChatMessage,
  } = useWebSocketHandler({
    accessToken,
    dispatch,
    serverId: currentServerId,
    showMessage,
  });

  useApiWebSocketHandler({
    accessToken,
    dispatch,
    serverId: currentServerId,
  });

  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (accessToken) dispatch(getUserProfile({ accessToken }));
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (currentServerId && accessToken) {
      dispatch(getServerData({ accessToken, serverId: currentServerId }));
    }
  }, [accessToken, currentServerId, dispatch]);

  useEffect(() => {
    if (currentChannelId && accessToken) {
      dispatch(
        getChannelMessages({
          accessToken,
          channelId: currentChannelId,
          numberOfMessages: MAX_MESSAGE_NUMBER,
          fromStart: numberOfStarterMessage,
        }),
      );
    }
    // Изменить логику получения сообщений, при переключении между серверами
  }, [accessToken, currentChannelId, currentServerId, dispatch]);

  return (
    <Box style={{ display: 'flex', height: '100dvh' }}>
      <ServerPanel />
      {isOpenHome ? (
        <Profile
          sendChatMessage={sendChatMessage}
          editChatMessage={editChatMessage}
          deleteChatMessage={deleteChatMessage}
        />
      ) : (
        <>
          <SideBar onClose={close} />
          {!isUserStreamView ? (
            <ChatSection
              openSidebar={open}
              openDetailsPanel={openDetailsPanel}
              sendMessage={sendMessage}
              editMessage={editMessage}
              deleteMessage={deleteMessage}
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
