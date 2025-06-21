import { LoadingState } from '~/shared';

export interface RoleInfo {
  id: string;
  serverId: string;
  name: string;
  tag: string;
  color: string;
}

export enum Setting {
  CanChangeRole,
  CanWorkChannels,
  CanDeleteUsers,
  CanMuteOther,
  CanDeleteOthersMessages,
  CanIgnoreMaxCount,
  CanCreateRole,
  CanCreateLessons,
  CanCheckAttendance,
}

export interface Settings {
  canChangeRole: boolean;
  canWorkChannels: boolean;
  canDeleteUsers: boolean;
  canMuteOther: boolean;
  canDeleteOthersMessages: boolean;
  canIgnoreMaxCount: boolean;
  canCreateRoles: boolean;
  canCreateLessons: boolean;
  canCheckAttendance: boolean;
}

export interface Role {
  role: RoleInfo;
  settings: Settings;
}

export interface GetRoles {
  roles: Role[];
}

export interface CreateRoleRequest {
  serverId: string;
  name: string;
  color: string;
}

export interface CreateRoleResponse {
  roleId: string;
  serverId: string;
  name: string;
  tag: string;
  color: string;
}

export interface UpdateRole {
  serverId: string;
  roleId: string;
  name: string;
  color: string;
}

export interface ChangeSettings {
  serverId: string;
  roleId: string;
  setting: Setting;
  add: boolean;
}

export interface RolesState {
  rolesList: Role[];
  rolesLoading: LoadingState;
  role: Role | null;
  error: string;
}
