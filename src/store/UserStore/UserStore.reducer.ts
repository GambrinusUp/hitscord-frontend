import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import {
  approveApplication,
  changeSettings,
  changeUserProfile,
  createApplication,
  declineApplication,
  deleteApplication,
  deleteFriendship,
  getApplicationsFrom,
  getApplicationsTo,
  getFriendshipList,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
} from './UserStore.actions';
import { User, UserState, LoginResponse, SettingType } from './UserStore.types';

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
    notifiable: false,
    friendshipApplication: false,
    nonFriendMessage: false,
    icon: null,
  },
  roomName: '11',
  accessToken: loadTokenFromLocalStorage(TokenType.ACCESS),
  refreshToken: loadTokenFromLocalStorage(TokenType.REFRESH),
  isLoggedIn: !!loadTokenFromLocalStorage(TokenType.ACCESS),
  applicationFrom: [],
  applicationTo: [],
  friendshipList: [],
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
      })
      .addCase(createApplication.pending, (state) => {
        state.error = '';
      })
      .addCase(createApplication.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getApplicationsFrom.fulfilled, (state, action) => {
        state.applicationFrom = action.payload.applications;
        state.error = '';
      })
      .addCase(getApplicationsTo.fulfilled, (state, action) => {
        state.applicationTo = action.payload.applications;
        state.error = '';
      })
      .addCase(deleteApplication.fulfilled, (state, { meta }) => {
        const applicationId = meta.arg.applicationId;
        state.applicationFrom = state.applicationFrom.filter(
          (application) => application.id !== applicationId,
        );
        state.error = '';
      })
      .addCase(declineApplication.fulfilled, (state, { meta }) => {
        const applicationId = meta.arg.applicationId;
        state.applicationTo = state.applicationTo.filter(
          (application) => application.id !== applicationId,
        );
        state.error = '';
      })
      .addCase(approveApplication.fulfilled, (state, { meta }) => {
        const applicationId = meta.arg.applicationId;
        state.applicationTo = state.applicationTo.filter(
          (application) => application.id !== applicationId,
        );
        state.error = '';
      })
      .addCase(getFriendshipList.fulfilled, (state, action) => {
        state.friendshipList = action.payload.users;
        state.error = '';
      })

      .addCase(deleteFriendship.fulfilled, (state, { meta }) => {
        const userId = meta.arg.userId;
        state.friendshipList = state.friendshipList.filter(
          (friend) => friend.userId !== userId,
        );
        state.error = '';
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
          getApplicationsFrom.pending,
          getApplicationsTo.pending,
          approveApplication.pending,
          declineApplication.pending,
          deleteApplication.pending,
          getFriendshipList.pending,
          deleteFriendship.pending,
          changeSettings.pending,
          changeUserProfile.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          getApplicationsFrom.rejected,
          getApplicationsTo.rejected,
          approveApplication.rejected,
          declineApplication.rejected,
          deleteApplication.rejected,
          getFriendshipList.rejected,
          deleteFriendship.rejected,
          changeSettings.rejected,
          changeUserProfile.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

//export const { } = UserSlice.actions;

export const UserReducer = UserSlice.reducer;
