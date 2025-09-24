import { useEffect, useState } from 'react';

import {
  getApplicationsFrom,
  getApplicationsTo,
  getFriendshipList,
} from '~/entities/friendship';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { Profile } from '~/widgets/profile';
import { ProfileContent } from '~/widgets/profileContent';
import { ProfileMenu } from '~/widgets/profileMenu';
import { ChatUsers } from '~/widgets/сhatUsers';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { activeChat } = useAppSelector((state) => state.chatsStore);
  const [activeLink, setActiveLink] = useState<
    'friends' | 'settings' | 'chats'
  >('chats');

  useEffect(() => {
    dispatch(getApplicationsFrom());
    dispatch(getApplicationsTo());
    dispatch(getFriendshipList());
  }, []);

  return (
    <>
      <ProfileMenu activeLink={activeLink} setActiveLink={setActiveLink} />
      <ProfileContent activeLink={activeLink} />
      {activeChat && <ChatUsers />}
      {!activeChat && activeLink !== 'settings' && <Profile />}
    </>
  );
};
