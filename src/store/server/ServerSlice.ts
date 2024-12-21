import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Message, Server } from '../../utils/types';

interface ServerState {
  servers: {
    [serverId: string]: Server;
  };
  currentServerId: string | null;
  currentChannelId: string | null;
}

const initialState: ServerState = {
  servers: {
    channel1: {
      name: 'test',
      textChannels: {
        channel1: {
          name: 'General',
          messages: [
            {
              id: 'msg1',
              content: 'Welcome to the General chat!',
              userId: 'user1',
              userName: 'Alice',
              timestamp: new Date().toISOString(),
              isOwnMessage: false,
            },
          ],
        },
        channel2: {
          name: 'Random',
          messages: [
            {
              id: 'msg2',
              content: 'Hello from Random chat!',
              userId: 'user2',
              userName: 'Bob',
              timestamp: new Date().toISOString(),
              isOwnMessage: false,
            },
          ],
        },
      },
    },
  },
  currentServerId: 'a062fcbd-05c6-4c85-9183-68a8d3466fa2',
  currentChannelId: 'channel1',
};

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    addServer: (
      state,
      action: PayloadAction<{ serverId: string; name: string }>
    ) => {
      const { serverId, name } = action.payload;
      state.servers[serverId] = { name, textChannels: {} };
    },

    addTextChannel: (
      state,
      action: PayloadAction<{
        serverId: string;
        channelId: string;
        name: string;
      }>
    ) => {
      const { serverId, channelId, name } = action.payload;
      const server = state.servers[serverId];
      if (server) {
        server.textChannels[channelId] = { name, messages: [] };
      }
    },

    editTextChannel: (
      state,
      action: PayloadAction<{
        serverId: string;
        channelId: string;
        name: string;
      }>
    ) => {
      const { serverId, channelId, name } = action.payload;
      const server = state.servers[serverId];
      if (server) {
        server.textChannels[channelId].name = name;
      }
    },

    deleteTextChannel: (
      state,
      action: PayloadAction<{
        serverId: string;
        channelId: string;
      }>
    ) => {
      const { serverId, channelId } = action.payload;
      const server = state.servers[serverId];
      if (state.currentChannelId === channelId) {
        state.currentChannelId = 'channel1';
      }
      if (server) {
        delete server.textChannels[channelId];
      }
    },

    setCurrentServer: (state, action: PayloadAction<string>) => {
      state.currentServerId = action.payload;
      state.currentChannelId = 'channel1';
    },

    setCurrentChannel: (state, action: PayloadAction<string>) => {
      state.currentChannelId = action.payload;
    },

    addMessage: (
      state,
      action: PayloadAction<{
        serverId: string;
        channelId: string;
        message: Message;
      }>
    ) => {
      const { serverId, channelId, message } = action.payload;
      const channel = state.servers[serverId]?.textChannels[channelId];
      if (channel) {
        channel.messages.push(message);
      }
    },
  },
});

export const {
  addServer,
  addTextChannel,
  editTextChannel,
  setCurrentServer,
  setCurrentChannel,
  addMessage,
  deleteTextChannel,
} = serverSlice.actions;

export default serverSlice.reducer;
