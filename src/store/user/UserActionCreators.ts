import { createAsyncThunk } from '@reduxjs/toolkit';

import { authAPI } from '../../api/authAPI';
import { getErrorMessage } from '../../helpers/getErrorMessage';
import { LoginCredentials, User } from '../../utils/types';

export const registerUser = createAsyncThunk<
  User,
  Partial<User>,
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
  User,
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
