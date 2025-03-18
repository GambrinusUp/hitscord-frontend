import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  getUserProfile,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from './UserStore.actions';
import { User, UserState, LoginResponse } from './UserStore.types';

enum TokenType {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

const loadTokenFromLocalStorage = (type: TokenType): string => {
  try {
    const token = localStorage.getItem(type);

    return token || '';
  } catch (err) {
    console.error('Could not load token', err);

    return '';
  }
};

const initialState: UserState = {
  user: {
    id: '',
    name: '',
    tag: '',
    mail: '',
    accontCreateDate: '',
  },
  roomName: '11',
  accessToken: loadTokenFromLocalStorage(TokenType.ACCESS),
  refreshToken: loadTokenFromLocalStorage(TokenType.REFRESH),
  isLoggedIn: !!loadTokenFromLocalStorage(TokenType.ACCESS),
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
          state.error = '';
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          state.isLoggedIn = true;
        },
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
          state.error = '';
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          state.isLoggedIn = true;
        },
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
          state.error = '';
          state.user = action.payload;
        },
      )
      .addCase(getUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = '';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.error = '';
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem('accessToken', '');
        localStorage.setItem('refreshToken', '');
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.accessToken = '';
        state.refreshToken = '';
        localStorage.setItem('accessToken', '');
        localStorage.setItem('refreshToken', '');
        state.isLoggedIn = false;
      })
      .addCase(refreshTokens.pending, (state) => {
        state.error = '';
        state.accessToken = '';
        state.refreshToken = '';
        state.isLoading = true;
      })
      .addCase(
        refreshTokens.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.error = '';
          state.isLoading = false;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          localStorage.setItem('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
      )
      .addCase(refreshTokens.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

//export const { } = UserSlice.actions;

export const UserReducer = UserSlice.reducer;
