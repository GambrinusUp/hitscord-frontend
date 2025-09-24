import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import {
  changeSettings,
  changeUserProfile,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from './actions';
import { USER_SLICE_NAME } from './const';
import { LoginResponse, SettingType, User, UserState } from './types';

import { LoadingState } from '~/shared';
import { TokenType } from '~/shared/lib/types';
import { loadTokenFromLocalStorage } from '~/shared/lib/utils';

const initialState: UserState = {
  user: {
    id: '',
    name: '',
    tag: '',
    mail: '',
    accontCreateDate: '',
    notifiable: false,
    friendshipApplication: false,
    nonFriendMessage: false,
    icon: null,
  },
  accessToken: loadTokenFromLocalStorage(TokenType.ACCESS),
  refreshToken: loadTokenFromLocalStorage(TokenType.REFRESH),
  isLoggedIn: !!loadTokenFromLocalStorage(TokenType.ACCESS),
  error: '',
  loading: LoadingState.IDLE,
};

export const UserSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.error = '';
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem(TokenType.ACCESS, action.payload.accessToken);
          localStorage.setItem(TokenType.REFRESH, action.payload.refreshToken);
          state.isLoggedIn = true;
        },
      )
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          console.log(action.payload);

          state.error = '';
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem(TokenType.ACCESS, action.payload.accessToken);
          localStorage.setItem(TokenType.REFRESH, action.payload.refreshToken);
          state.isLoggedIn = true;
        },
      )
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.error = '';
          state.user = action.payload;
        },
      )
      .addCase(logoutUser.fulfilled, (state) => {
        state.error = '';
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem(TokenType.ACCESS, '');
        localStorage.setItem(TokenType.REFRESH, '');
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem(TokenType.ACCESS, '');
        localStorage.setItem(TokenType.REFRESH, '');
        state.isLoggedIn = false;
      })
      .addCase(refreshTokens.pending, (state) => {
        state.error = '';
        state.accessToken = '';
        state.refreshToken = '';
        state.loading = LoadingState.PENDING;
      })
      .addCase(
        refreshTokens.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.error = '';
          state.loading = LoadingState.FULFILLED;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem(TokenType.ACCESS, action.payload.accessToken);
          localStorage.setItem(TokenType.REFRESH, action.payload.refreshToken);
        },
      )
      .addCase(refreshTokens.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = LoadingState.REJECTED;
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem(TokenType.ACCESS, '');
        localStorage.setItem(TokenType.REFRESH, '');
        state.isLoggedIn = false;
      })
      .addCase(changeSettings.fulfilled, (state, { meta }) => {
        const { type } = meta.arg;

        switch (type) {
          case SettingType.FRIENDSHIP:
            state.user.friendshipApplication =
              !state.user.friendshipApplication;
            break;
          case SettingType.NONFRIEND:
            state.user.nonFriendMessage = !state.user.nonFriendMessage;
            break;
          case SettingType.NOTIFIABLE:
            state.user.notifiable = !state.user.notifiable;
            break;
        }
      })
      .addCase(
        changeUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.error = '';
          state.user = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          changeSettings.pending,
          changeUserProfile.pending,
          logoutUser.pending,
          getUserProfile.pending,
          registerUser.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          registerUser.rejected,
          loginUser.rejected,
          changeSettings.rejected,
          changeUserProfile.rejected,
          getUserProfile.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

//export const { } = UserSlice.actions;

export const userReducer = UserSlice.reducer;
