import { ReactNode, useEffect } from 'react';

import { useAppSelector, useNotification } from '~/hooks';

export const ErrorsProvider = ({ children }: { children?: ReactNode }) => {
  const serverError = useAppSelector((state) => state.testServerStore.error);
  const usersError = useAppSelector((state) => state.userStore.error);
  const chatsError = useAppSelector((state) => state.chatsStore.error);
  const { showError } = useNotification();

  useEffect(() => {
    if (serverError !== '') {
      showError(serverError);
    }
  }, [serverError]);

  useEffect(() => {
    if (usersError !== '') {
      showError(usersError);
    }
  }, [usersError]);

  useEffect(() => {
    if (chatsError !== '') {
      showError(chatsError);
    }
  }, [chatsError]);

  return <>{children}</>;
};
