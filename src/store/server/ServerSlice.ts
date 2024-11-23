import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServerState {
  servers: {
    [serverId: string]: {
      name: string;
      textChannels: {
        [channelId: string]: {
          name: string;
          messages: {
            id: string;
            content: string;
            userId: string;
            userName: string;
            timestamp: string;
          }[];
        };
      };
    };
  };
  currentServerId: string | null;
  currentChannelId: string | null;
}

const initialState: ServerState = {
  servers: {
    server1: {
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
            },
          ],
        },
      },
    },
  },
  currentServerId: 'server1',
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

    setCurrentServer: (state, action: PayloadAction<string>) => {
      state.currentServerId = action.payload;
      state.currentChannelId = null;
    },

    setCurrentChannel: (state, action: PayloadAction<string>) => {
      state.currentChannelId = action.payload;
    },

    addMessage: (
      state,
      action: PayloadAction<{
        serverId: string;
        channelId: string;
        message: {
          id: string;
          content: string;
          userId: string;
          userName: string;
          timestamp: string;
        };
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
  setCurrentServer,
  setCurrentChannel,
  addMessage,
} = serverSlice.actions;

export default serverSlice.reducer;
