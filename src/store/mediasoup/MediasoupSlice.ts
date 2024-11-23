import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MediasoupState {
  consumers: any[];
  connected: boolean;
  users: any[];
  isMuted: boolean;
  isStreaming: boolean;
}

const initialState: MediasoupState = {
  consumers: [],
  connected: false,
  users: [],
  isMuted: false,
  isStreaming: false,
};

const MediasoupSlice = createSlice({
  name: 'mediasoup',
  initialState,
  reducers: {
    setConsumers(state, action: PayloadAction<any[]>) {
      state.consumers = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setUsers(state, action: PayloadAction<any[]>) {
      state.users = action.payload;
    },
    setIsMuted(state, action: PayloadAction<boolean>) {
      state.isMuted = action.payload;
    },
    setIsStreaming(state, action: PayloadAction<boolean>) {
      state.isStreaming = action.payload;
    },
  },
});

export const {
  setConsumers,
  setConnected,
  setUsers,
  setIsMuted,
  setIsStreaming,
} = MediasoupSlice.actions;

export default MediasoupSlice.reducer;
