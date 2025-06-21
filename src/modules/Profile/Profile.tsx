import { useEffect, useState } from 'react';

import { ChatUsers } from './components/ChatUsers';
import { ProfileMessagesSection } from './components/ProfileMessagesSection';
import { ProfileSideBar } from './components/ProfileSideBar';
import { ProfileThreadsPanel } from './components/ProfileThreadsPanel';
import { ProfileProps } from './Profile.types';

import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  getApplicationsFrom,
  getApplicationsTo,
  getFriendshipList,
} from '~/store/UserStore';

export const Profile = ({
  sendChatMessage,
  editChatMessage,
  deleteChatMessage,
}: ProfileProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const [activeLink, setActiveLink] = useState<
    'friends' | 'settings' | 'chats'
  >('chats');

  useEffect(() => {
    dispatch(getApplicationsFrom({ accessToken }));
    dispatch(getApplicationsTo({ accessToken }));
    dispatch(getFriendshipList({ accessToken }));
  }, []);

  return (
    <>
      <ProfileThreadsPanel
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
      <ProfileMessagesSection
        activeLink={activeLink}
        sendChatMessage={sendChatMessage}
        editChatMessage={editChatMessage}
        deleteChatMessage={deleteChatMessage}
      />
      {activeChat && <ChatUsers />}
      {!activeChat && activeLink !== 'settings' && <ProfileSideBar />}
    </>
  );
};
