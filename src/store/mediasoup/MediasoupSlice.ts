import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ActiveUser, UserInList } from '../../utils/types';

interface MediasoupState {
  isConnected: boolean;
  users: UserInList[];
  activeUsers: ActiveUser[];
}

const initialState: MediasoupState = {
  isConnected: false,
  users: [],
  activeUsers: [],
};

const MediasoupSlice = createSlice({
  name: 'mediasoup',
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setUsers(state, action: PayloadAction<UserInList[]>) {
      state.users = action.payload;
    },
    setActiveUsers(state, action: PayloadAction<ActiveUser[]>) {
      state.activeUsers = [...action.payload];
    },
  },
});

export const { setConnected, setUsers, setActiveUsers } =
  MediasoupSlice.actions;

export default MediasoupSlice.reducer;
