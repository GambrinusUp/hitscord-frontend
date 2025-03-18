export interface ServerState {
  serversList: ServerItem[];
  serverData: ServerData;
  currentServerId: string | null;
  currentChannelId: string | null;
  currentVoiceChannelId: string | null;
  messages: ChannelMessage[];
  isLoading: boolean;
  error: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface ServerItem {
  serverId: string;
  serverName: string;
}

export interface GetServersResponse {
  serversList: ServerItem[];
}
