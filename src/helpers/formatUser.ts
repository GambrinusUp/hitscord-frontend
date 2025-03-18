import { UserOnServer } from '~/store/ServerStore/ServerStore.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatUser = (rawMessage: any): UserOnServer => ({
  userId: rawMessage.UserId,
  userName: rawMessage.UserName,
  userTag: rawMessage.UserId,
  roleName: rawMessage.Role.Name,
});
