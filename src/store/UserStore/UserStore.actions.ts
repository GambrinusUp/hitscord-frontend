import { createAsyncThunk } from '@reduxjs/toolkit';

import { UserAPI } from './api/Auth';
import { FriendshipAPI } from './api/Friendship';
import {
  GetApplication,
  GetFriends,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  User,
} from './UserStore.types';

import { getErrorMessage } from '~/helpers/getErrorMessage';
import { RootState } from '~/store/store';

export const registerUser = createAsyncThunk<
  LoginResponse,
  RegisterCredentials,
  { rejectValue: string }
>('userSlice/registerUser', async (user, { rejectWithValue }) => {
  try {
    const response = await UserAPI.registerUser(user);

    return response;
  } catch (e) {
    return rejectWithValue(getErrorMessage(e));
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>('userSlice/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const response = await UserAPI.loginUser(loginData);

    return response;
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Неизвестная ошибка',
    );
  }
});

export const getUserProfile = createAsyncThunk<
  User,
  { accessToken: string },
  { rejectValue: string; state: RootState }
>(
  'userSlice/getUserProfile',
  async ({ accessToken }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await UserAPI.getProfile(accessToken);
      console.log(response);

      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);

      if (e.status === 401) {
        const state = getState();
        const { refreshToken } = state.userStore;

        if (refreshToken) {
          await dispatch(refreshTokens({ refreshToken })).unwrap();
        }
      }

      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const logoutUser = createAsyncThunk<
  void,
  { accessToken: string },
  { rejectValue: string }
>('userSlice/logoutUser', async ({ accessToken }, { rejectWithValue }) => {
  try {
    await UserAPI.logout(accessToken);
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Неизвестная ошибка',
    );
  }
});

export const refreshTokens = createAsyncThunk<
  LoginResponse,
  { refreshToken: string },
  { rejectValue: string }
>('userSlice/refreshTokens', async ({ refreshToken }, { rejectWithValue }) => {
  try {
    const response = await UserAPI.refreshToken(refreshToken);

    return response;
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Не удалось обновить токены',
    );
  }
});

export const createApplication = createAsyncThunk<
  void,
  { accessToken: string; userTag: string },
  { rejectValue: string }
>(
  'userSlice/createApplication',
  async ({ accessToken, userTag }, { rejectWithValue }) => {
    try {
      await FriendshipAPI.createApplication(accessToken, userTag);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getApplicationsFrom = createAsyncThunk<
  GetApplication,
  { accessToken: string },
  { rejectValue: string }
>(
  'userSlice/getApplicationsFrom',
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await FriendshipAPI.getApplicationFrom(accessToken);

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getApplicationsTo = createAsyncThunk<
  GetApplication,
  { accessToken: string },
  { rejectValue: string }
>(
  'userSlice/getApplicationsTo',
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await FriendshipAPI.getApplicationTo(accessToken);

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const approveApplication = createAsyncThunk<
  void,
  { accessToken: string; applicationId: string },
  { rejectValue: string }
>(
  'userSlice/approveApplication',
  async ({ accessToken, applicationId }, { rejectWithValue }) => {
    try {
      await FriendshipAPI.approveApplication(accessToken, applicationId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const declineApplication = createAsyncThunk<
  void,
  { accessToken: string; applicationId: string },
  { rejectValue: string }
>(
  'userSlice/declineApplication',
  async ({ accessToken, applicationId }, { rejectWithValue }) => {
    try {
      await FriendshipAPI.declineApplication(accessToken, applicationId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const deleteApplication = createAsyncThunk<
  void,
  { accessToken: string; applicationId: string },
  { rejectValue: string }
>(
  'userSlice/deleteApplication',
  async ({ accessToken, applicationId }, { rejectWithValue }) => {
    try {
      await FriendshipAPI.deleteApplication(accessToken, applicationId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getFriendshipList = createAsyncThunk<
  GetFriends,
  { accessToken: string },
  { rejectValue: string }
>(
  'userSlice/getFriendshipList',
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await FriendshipAPI.getFriendshipList(accessToken);

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const deleteFriendship = createAsyncThunk<
  void,
  { accessToken: string; userId: string },
  { rejectValue: string }
>(
  'userSlice/deleteFriendship',
  async ({ accessToken, userId }, { rejectWithValue }) => {
    try {
      await FriendshipAPI.deleteFriendship(accessToken, userId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);
