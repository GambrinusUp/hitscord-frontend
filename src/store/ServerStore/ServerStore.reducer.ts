import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  changeRole,
  createChannel,
  createMessage,
  createServer,
  deleteChannel,
  deleteMessage,
  deleteServer,
  editMessage,
  getChannelMessages,
  getMoreMessages,
  getServerData,
  getUserServers,
  subscribeToServer,
  unsubscribeFromServer,
} from './ServerStore.actions';
import {
  ChannelMessage,
  ServerData,
  ServerItem,
  ServerState,
  UserOnServer,
} from './ServerStore.types';

import { LoadingState } from '~/shared';

const initialState: ServerState = {
  serversList: [],
  serverData: {
    serverId: '',
    serverName: '',
    roles: [],
    userRoleId: '',
    userRole: '',
    users: [],
    channels: {
      textChannels: [],
      voiceChannels: [],
    },
    isCreator: false,
    canChangeRole: false,
    canDeleteUsers: false,
    canWorkWithChannels: false,
  },
  currentServerId: null,
  currentChannelId: null,
  currentVoiceChannelId: null,
  messages: [],
  hasNewMessage: false,
  messagesStatus: LoadingState.IDLE,
  isLoading: false,
  error: '',
};

const testServerSlice = createSlice({
  name: 'testServer',
  initialState,
  reducers: {
    setCurrentServerId: (state, action: PayloadAction<string>) => {
      state.currentServerId = action.payload;
      state.error = '';
    },
    setCurrentChannelId: (state, action: PayloadAction<string | null>) => {
      state.currentChannelId = action.payload;
    },
    setCurrentVoiceChannelId: (state, action: PayloadAction<string | null>) => {
      state.currentVoiceChannelId = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChannelMessage>) => {
      const { channelId } = action.payload;

      if (channelId === state.currentChannelId) {
        state.messages.push(action.payload);
        state.hasNewMessage = true;
      }
    },
    deleteMessageWs: (
      state,
      action: PayloadAction<{ channelId: string; messageId: string }>,
    ) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload.messageId,
      );
    },
    editMessageWs: (state, action: PayloadAction<ChannelMessage>) => {
      const index = state.messages.findIndex(
        (message) => message.id === action.payload.id,
      );

      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    // Проверку на добавление на конкретном сервере
    addUserWs: (state, action: PayloadAction<UserOnServer>) => {
      console.log(state.currentServerId);
      console.log(state.serverData.users);
      state.serverData.users.push(action.payload);
    },
    deleteUserWs: (
      state,
      action: PayloadAction<{ UserId: string; ServerId: string }>,
    ) => {
      if (action.payload.ServerId === state.currentServerId) {
        state.serverData.users = state.serverData.users.filter(
          (user) => user.userId !== action.payload.UserId,
        );
      }
    },
    clearServerData: (state) => {
      state.messages = [];
      state.currentServerId = null;
      state.currentChannelId = null;
      state.serverData = {
        serverId: '',
        serverName: '',
        roles: [],
        userRoleId: '',
        userRole: '',
        users: [],
        channels: {
          textChannels: [],
          voiceChannels: [],
        },
        isCreator: false,
        canChangeRole: false,
        canDeleteUsers: false,
        canWorkWithChannels: false,
      };
    },
    clearHasNewMessage: (state) => {
      state.hasNewMessage = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserServers.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(
        getUserServers.fulfilled,
        (state, action: PayloadAction<ServerItem[]>) => {
          console.log(action.payload);
          state.serversList = action.payload;
          state.isLoading = false;
          state.error = '';
        },
      )
      .addCase(getUserServers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getServerData.pending, (state) => {
        state.isLoading = true;
        state.serverData = {
          serverId: '',
          serverName: '',
          roles: [],
          userRoleId: '',
          userRole: '',
          users: [],
          channels: {
            textChannels: [],
            voiceChannels: [],
          },
          isCreator: false,
          canChangeRole: false,
          canDeleteUsers: false,
          canWorkWithChannels: false,
        };
        state.error = '';
      })
      .addCase(
        getServerData.fulfilled,
        (state, action: PayloadAction<ServerData>) => {
          state.serverData = action.payload;

          const newChannels = action.payload.channels.textChannels;
          let newCurrentChannelId = state.currentChannelId;

          const currentChannel = newChannels.find(
            (channel) => channel.channelId === newCurrentChannelId,
          );

          if (!currentChannel) {
            newCurrentChannelId =
              newChannels.length > 0 ? newChannels[0].channelId : null;
            state.messages = [];
          }

          state.isLoading = false;
          state.error = '';
        },
      )
      .addCase(getServerData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createServer.pending, (state) => {
        state.error = '';
      })
      .addCase(createServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(createServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteServer.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(deleteServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(changeRole.pending, (state) => {
        state.error = '';
      })
      .addCase(changeRole.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(changeRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(subscribeToServer.pending, (state) => {
        state.error = '';
      })
      .addCase(subscribeToServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(subscribeToServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getChannelMessages.pending, (state) => {
        state.messagesStatus = LoadingState.PENDING;
        state.isLoading = true;
        state.error = '';
      })
      .addCase(
        getChannelMessages.fulfilled,
        (state, action: PayloadAction<ChannelMessage[]>) => {
          state.messages = action.payload;
          state.hasNewMessage = false;
          state.messagesStatus = LoadingState.FULFILLED;
          state.isLoading = false;
          state.error = '';
        },
      )
      .addCase(getChannelMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.messagesStatus = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(getMoreMessages.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(
        getMoreMessages.fulfilled,
        (state, action: PayloadAction<ChannelMessage[]>) => {
          state.messages = [...action.payload, ...state.messages];
          state.isLoading = false;
          state.error = '';
        },
      )
      .addCase(getMoreMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createMessage.pending, (state) => {
        state.error = '';
      })
      .addCase(createMessage.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteMessage.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteMessage.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(editMessage.pending, (state) => {
        state.error = '';
      })
      .addCase(editMessage.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createChannel.pending, (state) => {
        state.error = '';
      })
      .addCase(createChannel.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteChannel.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteChannel.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(unsubscribeFromServer.pending, (state) => {
        state.error = '';
      })
      .addCase(unsubscribeFromServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(unsubscribeFromServer.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentServerId,
  setCurrentChannelId,
  setCurrentVoiceChannelId,
  addMessage,
  deleteMessageWs,
  editMessageWs,
  addUserWs,
  deleteUserWs,
  clearServerData,
  clearHasNewMessage,
} = testServerSlice.actions;

export const ServerReducer = testServerSlice.reducer;
