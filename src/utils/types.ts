export interface User {
  id: string;
  name: string;
  tag: string;
  mail: string;
  accontCreateDate: string;
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

export interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: string;
  isOwnMessage: boolean;
}

export interface TextChannell {
  name: string;
  messages: Message[];
}

export interface Server {
  name: string;
  textChannels: Record<string, TextChannell>;
}

export interface EditModal {
  isEdit: boolean;
  initialData: string;
  channelId: string;
}

export interface ActiveUser {
  producerId: string;
  volume: number;
}

export interface UserInList {
  socketId: string;
  producerId: string;
  userName: string;
}

export interface Room {
  roomName: string;
  users: UserInList[];
}

export interface ServerItem {
  serverId: string;
  serverName: string;
}

export interface GetServersResponse {
  serversList: ServerItem[];
}

export interface Role {
  id: string;
  name: string;
}

export interface UserOnServer {
  userId: string;
  userName: string;
  userTag: string;
  roleName: string;
}

export interface TextChannel {
  channelId: string;
  channelName: string;
  canWrite: boolean;
}

export interface UserInVoiceChannel {
  userId: string;
  userName: string;
}

export interface VoiceChannel {
  channelId: string;
  channelName: string;
  canJoin: boolean;
  users: UserInVoiceChannel[];
}

export interface AnnouncementChannel {
  channelId: string;
  channelName: string;
  canWrite: boolean;
  annoucementRoles: any[];
}

export interface ServerData {
  serverId: string;
  serverName: string;
  roles: Role[];
  userRoleId: string;
  userRole: string;
  users: UserOnServer[];
  channels: {
    textChannels: TextChannel[];
    voiceChannels: VoiceChannel[];
    announcementChannels?: AnnouncementChannel[];
  };
}

export interface ChannelMessage {
  serverId: string;
  channelId: string;
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  modifiedAt: string | null;
  nestedChannelId: boolean | null;
  replyToMessage: string | null;
}

export enum ChannelType {
  TEXT_CHANNEL = 0,
  VOICE_CHANNEL = 1,
}
