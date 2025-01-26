import { createAsyncThunk } from '@reduxjs/toolkit';

import { authAPI } from '../../api/authAPI';
import { getErrorMessage } from '../../helpers/getErrorMessage';
import {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  User,
} from '../../utils/types';
import { RootState } from '../store';

export const registerUser = createAsyncThunk<
  LoginResponse,
  RegisterCredentials,
  { rejectValue: string }
>('userSlice/registerUser', async (user, { rejectWithValue }) => {
  try {
    const response = await authAPI.registerUser(user);
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
    const response = await authAPI.loginUser(loginData);
    return response;
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Неизвестная ошибка'
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
      const response = await authAPI.getProfile(accessToken);
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
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  { accessToken: string },
  { rejectValue: string }
>('userSlice/logoutUser', async ({ accessToken }, { rejectWithValue }) => {
  try {
    await authAPI.logout(accessToken);
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Неизвестная ошибка'
    );
  }
});

export const refreshTokens = createAsyncThunk<
  LoginResponse,
  { refreshToken: string },
  { rejectValue: string }
>('userSlice/refreshTokens', async ({ refreshToken }, { rejectWithValue }) => {
  try {
    const response = await authAPI.refreshToken(refreshToken);
    return response;
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Не удалось обновить токены'
    );
  }
});
