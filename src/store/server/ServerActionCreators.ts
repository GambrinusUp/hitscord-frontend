import { createAsyncThunk } from '@reduxjs/toolkit';

import { serverAPI } from '../../api/serverAPI';
import { ServerData, ServerItem } from '../../utils/types';

export const getUserServers = createAsyncThunk<
  ServerItem[],
  { accessToken: string },
  { rejectValue: string }
>(
  'testServerSlice/getUserServers',
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await serverAPI.getServers(accessToken);
      return response.serversList;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const getServerData = createAsyncThunk<
  ServerData,
  { accessToken: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/getServerData',
  async ({ accessToken, serverId }, { rejectWithValue }) => {
    try {
      const response = await serverAPI.getServerData(accessToken, serverId);
      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const createServer = createAsyncThunk<
  void,
  { accessToken: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/createServer',
  async ({ accessToken, name }, { rejectWithValue }) => {
    try {
      await serverAPI.createServer(accessToken, name);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const deleteServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/deleteServer',
  async ({ accessToken, serverId }, { rejectWithValue }) => {
    try {
      await serverAPI.deleteServer(accessToken, serverId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const changeRole = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userId: string; role: string },
  { rejectValue: string }
>(
  'testServerSlice/changeRole',
  async ({ accessToken, serverId, userId, role }, { rejectWithValue }) => {
    try {
      await serverAPI.changeRole(accessToken, serverId, userId, role);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const subscribeToServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userName: string },
  { rejectValue: string }
>(
  'testServerSlice/subscribeToServer',
  async ({ accessToken, serverId, userName }, { rejectWithValue }) => {
    try {
      await serverAPI.subscribeToServer(accessToken, serverId, userName);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);
