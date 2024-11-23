import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../../utils/types';
import { loginUser, registerUser } from './UserActionCreators';

export interface UserState {
  user: User;
  roomName: string;
  isLoggedIn: boolean;
  error: string;
  isLoading: boolean;
}

/*
{
    "id": "8b9c",
    "email": "test@mail",
    "fullName": "test",
    "course": "3",
    "group": "test",
    "password": "test"
}
*/

const initialState: UserState = {
  user: {
    id: '',
    email: '',
    fullName: 'Anonymous',
    course: '',
    group: '',
    password: '',
  },
  roomName: '11',
  isLoggedIn: false,
  error: '',
  isLoading: false,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.user.fullName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = '';
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setUserName } = UserSlice.actions;

export default UserSlice.reducer;
