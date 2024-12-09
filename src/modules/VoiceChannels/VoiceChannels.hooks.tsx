import { useEffect, useState } from 'react';

import socket from '../../api/socket';
import { ActiveUser } from '../../utils/types';

export const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on(
      'active-speakers',
      ({ activeSpeakers }: { activeSpeakers: ActiveUser[] }) => {
        //console.log(activeSpeakers);
        setActiveUsers(activeSpeakers);
      }
    );

    return () => {
      socket.off('active-speakers');
    };
  }, []);

  return activeUsers;
};
