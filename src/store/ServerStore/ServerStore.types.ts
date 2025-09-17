import { LoadingState } from '~/shared';
import { RoleType } from '~/store/RolesStore';

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
  bannedUsers: BannedUser[];
  pageBannedUsers: number;
  totalPagesBannedUsers: number;
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
  messageType: MessageType;
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
  type: RoleType;
}

export interface UserOnServer {
  serverId: string;
  userId: string;
  userName: string;
  userTag: string;
  icon: string | null;
  roleId: string;
  roleName: string;
  roleType: RoleType;
  mail: string;
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
}

export interface TextChannel {
  channelId: string;
  channelName: string;
  canWrite: true;
  canWriteSub: true;
  isNotifiable: true;
}

export enum MuteStatus {
  NotMuted,
  SelfMuted,
  Muted,
}

export interface UserInVoiceChannel {
  userId: string;
  muteStatus: MuteStatus;
  isMuted: boolean;
}

export interface VoiceChannel {
  channelId: string;
  channelName: string;
  canJoin: boolean;
  users: UserInVoiceChannel[];
  maxCount: number;
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
  userRoleType: RoleType;
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

export enum MessageType {
  Classic,
  Vote,
}

export interface CreateMessageWs {
  Token: string;
  ChannelId: string;
  ReplyToMessageId?: string;
  MessageType: MessageType;
  Classic: {
    Text: string;
    NestedChannel: boolean;
    Files?: string[];
  };
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

export interface BannedUser {
  userId: string;
  userName: string;
  userTag: string;
  mail: string;
  banReason?: string;
  banTime: string;
}

export interface BannedUserResponse {
  bannedList: BannedUser[];
  page: number;
  size: number;
  total: number;
}
