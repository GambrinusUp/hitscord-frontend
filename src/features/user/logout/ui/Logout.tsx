import { ActionIcon } from '@mantine/core';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { logoutUser } from '~/entities/user';
import { useAppDispatch } from '~/hooks';
import { clearServerData } from '~/store/ServerStore';

export const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    dispatch(clearServerData());

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <ActionIcon size="lg" variant="transparent" onClick={handleLogout}>
      <LogOut size={24} color="#fff" />
    </ActionIcon>
  );
};
