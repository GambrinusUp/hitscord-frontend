import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  userName: string;
  roomName: string;
}

const initialState: UserState = {
  userName: '',
  roomName: '11',
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
  },
});

export const { setUserName } = UserSlice.actions;

export default UserSlice.reducer;
