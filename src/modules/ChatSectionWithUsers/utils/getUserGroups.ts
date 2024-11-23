interface User {
  socketId: string;
  producerId: string;
  userName: string;
}

interface UserGroup {
  userName: string;
  producerIds: string[];
}

export const getUserGroups = (users: User[]): Record<string, UserGroup> => {
  const usersGroup = users.reduce((acc, user) => {
    if (!acc[user.socketId]) {
      acc[user.socketId] = { userName: user.userName, producerIds: [] };
    }
    acc[user.socketId].producerIds.push(user.producerId);
    return acc;
  }, {} as Record<string, UserGroup>);
  return usersGroup;
};
