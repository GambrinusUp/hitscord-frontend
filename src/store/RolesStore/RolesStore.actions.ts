import { createAsyncThunk } from '@reduxjs/toolkit';

import { RolesAPI } from './api';
import {
  ChangeSettings,
  CreateRoleRequest,
  CreateRoleResponse,
  GetRoles,
  UpdateRole,
} from './RolesStore.types';

export const getRoles = createAsyncThunk<
  GetRoles,
  { accessToken: string; serverId: string },
  { rejectValue: string }
>(
  'rolesSlice/getRoles',
  async ({ accessToken, serverId }, { rejectWithValue }) => {
    try {
      const response = await RolesAPI.getRoles(accessToken, serverId);

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const createRole = createAsyncThunk<
  CreateRoleResponse,
  { accessToken: string; role: CreateRoleRequest },
  { rejectValue: string }
>(
  'rolesSlice/createRole',
  async ({ accessToken, role }, { rejectWithValue, dispatch }) => {
    try {
      const response = await RolesAPI.createRole(accessToken, role);

      dispatch(getRoles({ accessToken, serverId: role.serverId }));

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const deleteRole = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; roleId: string },
  { rejectValue: string }
>(
  'rolesSlice/deleteRole',
  async ({ accessToken, serverId, roleId }, { rejectWithValue }) => {
    try {
      await RolesAPI.deleteRole(accessToken, serverId, roleId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const updateRole = createAsyncThunk<
  void,
  { accessToken: string; updatedRole: UpdateRole },
  { rejectValue: string }
>(
  'rolesSlice/updateRole',
  async ({ accessToken, updatedRole }, { rejectWithValue }) => {
    try {
      await RolesAPI.updateRole(accessToken, updatedRole);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const updateRoleSettings = createAsyncThunk<
  void,
  { accessToken: string; updatedRoleSettings: ChangeSettings },
  { rejectValue: string }
>(
  'rolesSlice/updateRoleSettings',
  async ({ accessToken, updatedRoleSettings }, { rejectWithValue }) => {
    try {
      await RolesAPI.updateRoleSettings(accessToken, updatedRoleSettings);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);
