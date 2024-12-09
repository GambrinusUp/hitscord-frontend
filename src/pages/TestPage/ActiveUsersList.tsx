import React from 'react';

//import { ActiveUser } from '../../utils/types';
//import { useMemo } from 'react';
//import { useMediaContext } from '../../context/MediaContext/useMediaContext';
//import { useAppSelector } from '../../hooks/redux';
import { ActiveUser } from '../../utils/types';

interface ActiveUsersListProps {
  activeUsers: ActiveUser[];
}

const ActiveUsersList = React.memo(({ activeUsers }: ActiveUsersListProps) => {
  return (
    <div>
      <h1>Active Users:</h1>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.producerId}>
            {user.producerId}: {user.volume}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ActiveUsersList;
