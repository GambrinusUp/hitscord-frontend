import { useAppSelector } from '~/hooks';

export const useVotes = () => {
  const { serverData } = useAppSelector((state) => state.testServerStore);
  const { users } = serverData;

  const getVotedUsers = (votedUsersIds: string[]): number => {
    const votedUsersCount = votedUsersIds.reduce((acc, val) => {
      const votedUser = users.some((user) => user.userId === val);

      return votedUser ? acc + 1 : acc;
    }, 0);

    const totalUsersCount = users.length;

    if (totalUsersCount === 0) {
      return 0;
    }

    return Math.round((votedUsersCount / totalUsersCount) * 100);
  };

  return {
    getVotedUsers,
  };
};
