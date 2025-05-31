export enum UserType {
  APPLICATION_FROM = 'APPLICATION_FROM',
  APPLICATION_TO = 'APPLICATION_TO',
  FRIEND = 'FRIEND',
}

export interface UserItemProps {
  applicationId?: string;
  type: UserType;
  userName: string;
  userTag: string;
  createdAt?: string;
  userId: string;
}
