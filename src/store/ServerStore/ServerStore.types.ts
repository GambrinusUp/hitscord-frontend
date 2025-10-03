import { MessageFile } from '~/entities/chat';
import { FileResponse } from '~/entities/files';
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

  numberOfMessages: number;
  startMessageId: number;
  remainingMessagesCount: number;
  allMessagesCount: number;

  error: string;
}

export interface ChannelMessage {
  text: string;
  modifiedAt: string | null;
  nestedChannel: string | null;
  files: MessageFile[] | null;
  messageType: MessageType;
  serverId: string | null;
  channelId: string;
  id: number;
  authorId: string;
  createdAt: string;
  replyToMessage: string | null;
}

export interface GetMessage {
  messages: ChannelMessage[];
  numberOfMessages: number;
  startMessageId: number;
  remainingMessagesCount: number;
  allMessagesCount: number;
}

export enum ChannelType {
  TEXT_CHANNEL = 0,
  VOICE_CHANNEL = 1,
  NOTIFICATION_CHANNEL = 2,
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
  roles: UserRoleOnServer[];
  notifiable: boolean;
  friendshipApplication: boolean;
  nonFriendMessage: boolean;
  isFriend: boolean;
}

export interface TextChannel {
  channelId: string;
  channelName: string;
  canWrite: boolean;
  canWriteSub: boolean;
  isNotifiable: boolean;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  lastReadedMessageId: number;
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

export interface UserRoleOnServer {
  roleId: string;
  roleName: string;
  roleType: number;
}

export interface ServerData {
  serverId: string;
  serverName: string;
  icon: string | null;
  isClosed: boolean;
  roles: Role[];
  userRoles: UserRoleOnServer[];
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
  isNotifiable: boolean;
  icon: FileResponse | null;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
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
  MessageId: number;
  Text: string;
}

export interface DeleteMessageWs {
  Token: string;
  MessageId: number;
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
