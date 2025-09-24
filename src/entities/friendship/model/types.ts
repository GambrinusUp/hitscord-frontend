import { LoadingState } from '~/shared';

export interface Friend {
  userId: string;
  userName: string;
  userTag: string;
  mail: string;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
}

export interface Application {
  id: string;
  user: Friend;
  createdAt: string;
}

export interface GetApplication {
  applications: Application[];
}

export interface GetFriends {
  users: Friend[];
}

export interface FriendshipState {
  applicationFrom: Application[];
  applicationTo: Application[];
  friendshipList: Friend[];
  loading: LoadingState;
  error: string;
}
