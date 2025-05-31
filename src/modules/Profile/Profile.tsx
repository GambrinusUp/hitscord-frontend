import { useEffect, useState } from 'react';

import { ProfileMessagesSection } from './components/ProfileMessagesSection';
import { ProfileSideBar } from './components/ProfileSideBar';
import { ProfileThreadsPanel } from './components/ProfileThreadsPanel';

import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  getApplicationsFrom,
  getApplicationsTo,
  getFriendshipList,
} from '~/store/UserStore';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const [activeLink, setActiveLink] = useState<'friends' | 'settings'>(
    'friends',
  );

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
      <ProfileMessagesSection activeLink={activeLink} />
      <ProfileSideBar />
    </>
  );
};
