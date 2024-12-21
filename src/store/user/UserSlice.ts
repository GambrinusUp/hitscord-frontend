import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LoginResponse, User } from '../../utils/types';
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from './UserActionCreators';

const loadTokenFromLocalStorage = () => {
  try {
    const token = localStorage.getItem('accessToken');
    return token ? token : '';
  } catch (err) {
    console.error('Could not load token', err);
    return '';
  }
};

export interface UserState {
  user: User;
  roomName: string;
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  error: string;
  isLoading: boolean;
}

const initialState: UserState = {
  user: {
    name: '',
    tag: '',
    mail: '',
    accontCreateDate: '',
  },
  roomName: '11',
  accessToken: loadTokenFromLocalStorage(),
  refreshToken: '',
  isLoggedIn: !!loadTokenFromLocalStorage(),
  error: '',
  isLoading: false,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = '';
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('accessToken', action.payload.accessToken);
          state.isLoggedIn = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.error = '';
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('accessToken', action.payload.accessToken);
          state.isLoggedIn = true;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.error = '';
      })
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        }
      )
      .addCase(getUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = '';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem('accessToken', '');
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

//export const { } = UserSlice.actions;

export default UserSlice.reducer;
