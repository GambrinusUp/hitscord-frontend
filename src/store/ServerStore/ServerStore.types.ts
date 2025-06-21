import { LoadingState } from '~/shared';

export interface ServerState {
  serversList: ServerItem[];
  serverData: ServerData;
  currentServerId: string | null;
  currentChannelId: string | null;
  currentVoiceChannelId: string | null;
  messages: ChannelMessage[];
  hasNewMessage: boolean;
  messagesStatus: LoadingState;
  roleSettings: GetChannelSettings;
  isLoading: boolean;
  messageIsLoading: LoadingState;
  numberOfStarterMessage: number;
  remainingMessagesCount: number;
  error: string;
}

export interface ChannelMessage {
  serverId: string;
  channelId: string;
  id: string;
  text: string;
  authorId: string;
  createdAt: string;
  modifiedAt: string | null;
  nestedChannelId: boolean | null;
  replyToMessage: string | null;
}

export interface GetMessage {
  messages: ChannelMessage[];
  numberOfMessages: number;
  numberOfStarterMessage: number;
  remainingMessagesCount: number;
  allMessagesCount: number;
}

export enum ChannelType {
  TEXT_CHANNEL = 0,
  VOICE_CHANNEL = 1,
}

export interface Role {
  id: string;
  serverId: string;
  name: string;
  tag: string;
  color: string;
}

export interface UserOnServer {
  userId: string;
  userName: string;
  userTag: string;
  icon: string | null;
  roleName: string;
  mail: string;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
}

export interface TextChannel {
  channelId: string;
  channelName: string;
  canWrite: boolean;
}

export interface UserInVoiceChannel {
  userId: string;
  isMuted: boolean;
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
  icon: string | null;
  roles: Role[];
  userRoleId: string;
  userRole: string;
  isCreator: boolean;
  permissions: {
    canChangeRole: boolean;
    canWorkChannels: boolean;
    canDeleteUsers: boolean;
    canMuteOther: boolean;
    canDeleteOthersMessages: boolean;
    canIgnoreMaxCount: boolean;
    canCreateRoles: boolean;
  };
  isNotifiable: boolean;
  users: UserOnServer[];
  channels: {
    textChannels: TextChannel[];
    voiceChannels: VoiceChannel[];
    notificationChannels: [];
  };
}

export interface ServerItem {
  serverId: string;
  serverName: string;
}

export interface GetServersResponse {
  serversList: ServerItem[];
}

export interface CreateMessageWs {
  Token: string;
  ChannelId: string;
  Text: string;
  NestedChannel: boolean;
}

export interface EditMessageWs {
  Token: string;
  MessageId: string;
  Text: string;
}

export interface DeleteMessageWs {
  Token: string;
  MessageId: string;
}

export interface ChannelSettings {
  channelId: string;
  add: boolean;
  type: number;
  roleId: string;
}

export interface GetChannelSettings {
  canSee: Role[] | null;
  canJoin: Role[] | null;
  canWrite: Role[] | null;
  canWriteSub: Role[] | null;
  canUse: Role[] | null;
  notificated: Role[] | null;
}
