import { UserOnServer } from '~/store/ServerStore/ServerStore.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatUser = (rawMessage: any): UserOnServer => ({
  serverId: rawMessage.ServerId,
  userId: rawMessage.UserId,
  userName: rawMessage.UserName,
  userTag: rawMessage.UserTag,
  icon: rawMessage.Icon,
  notifiable: rawMessage.Notifiable,
  friendshipApplication: rawMessage.FriendshipApplication,
  nonFriendMessage: rawMessage.NonFriendMessage,
  roles: rawMessage.Roles,
  isFriend: rawMessage.IsFriend,
});
