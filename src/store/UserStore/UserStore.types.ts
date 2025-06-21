export interface UserState {
  user: User;
  roomName: string;
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  applicationFrom: Application[];
  applicationTo: Application[];
  friendshipList: Friend[];
  error: string;
  isLoading: boolean;
}

export interface User {
  id: string;
  name: string;
  tag: string;
  mail: string;
  accontCreateDate: string;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
  icon: string | null;
}

export interface LoginCredentials {
  mail: string;
  password: string;
}

export interface RegisterCredentials {
  mail: string;
  password: string;
  accountName: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

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

export enum SettingType {
  NOTIFIABLE = 'notifiable',
  FRIENDSHIP = 'friendship',
  NONFRIEND = 'nonfriend',
}

export interface ChangeProfileData {
  name: string;
  mail: string;
}
