import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import {
  changeChannelName,
  changeNameOnServer,
  changeRole,
  changeServerName,
  changeTextChannelSettings,
  changeVoiceChannelSettings,
  createChannel,
  createMessage,
  createServer,
  deleteChannel,
  deleteMessage,
  deleteServer,
  deleteUserFromServer,
  editMessage,
  getChannelMessages,
  getChannelSettings,
  getMoreMessages,
  getServerData,
  getUserServers,
  selfMute,
  subscribeToServer,
  unsubscribeFromServer,
} from './ServerStore.actions';
import {
  ChannelMessage,
  GetChannelSettings,
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
  roleSettings: {
    canSee: null,
    canJoin: null,
    canWrite: null,
    canWriteSub: null,
    canUse: null,
    notificated: null,
  },
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
      state.roleSettings = {
        canSee: null,
        canJoin: null,
        canWrite: null,
        canWriteSub: null,
        canUse: null,
        notificated: null,
      };
    },
    clearHasNewMessage: (state) => {
      state.hasNewMessage = false;
    },
    setNewServerName: (state, action: PayloadAction<{ name: string }>) => {
      state.serverData.serverName = action.payload.name;
    },
    setNewUserName: (
      state,
      action: PayloadAction<{ userId: string; name: string }>,
    ) => {
      const userIndex = state.serverData.users.findIndex(
        (user) => user.userId === action.payload.userId,
      );

      if (userIndex !== -1) {
        state.serverData.users[userIndex].userName = action.payload.name;
      }
    },
    removeUser: (state, action: PayloadAction<{ userId: string }>) => {
      const userIndex = state.serverData.users.findIndex(
        (user) => user.userId === action.payload.userId,
      );

      if (userIndex !== -1) {
        state.serverData.users.splice(userIndex, 1);
      }
    },
    removeServer: (state, action: PayloadAction<{ serverId: string }>) => {
      const serverIndex = state.serversList.findIndex(
        (server) => server.serverId === action.payload.serverId,
      );

      if (serverIndex !== -1) {
        state.serversList.splice(serverIndex, 1);
      }
    },
    editChannelName: (
      state,
      action: PayloadAction<{ channelId: string; newName: string }>,
    ) => {
      const { channelId, newName } = action.payload;

      const textChannel = state.serverData.channels.textChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (textChannel) {
        textChannel.channelName = newName;

        return;
      }

      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (voiceChannel) {
        voiceChannel.channelName = newName;

        return;
      }
    },
    addUserOnVoiceChannel: (
      state,
      action: PayloadAction<{ channelId: string; userId: string }>,
    ) => {
      const { channelId, userId } = action.payload;

      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (voiceChannel) {
        if (!voiceChannel.users.some((user) => user.userId === userId)) {
          voiceChannel.users.push({ userId, isMuted: false });
        }
      }
    },
    removeUserFromVoiceChannel: (
      state,
      action: PayloadAction<{ channelId: string; userId: string }>,
    ) => {
      const { channelId, userId } = action.payload;

      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (voiceChannel) {
        voiceChannel.users = voiceChannel.users.filter(
          (user) => user.userId !== userId,
        );
      }
    },
    toggleUserMuteStatus: (
      state,
      action: PayloadAction<{
        channelId: string;
        userId: string;
        isMuted: boolean;
      }>,
    ) => {
      const { channelId, userId, isMuted } = action.payload;

      const voiceChannel = state.serverData.channels.voiceChannels.find(
        (channel) => channel.channelId === channelId,
      );

      if (voiceChannel) {
        voiceChannel.users = voiceChannel.users.map((user) =>
          user.userId === userId ? { ...user, isMuted } : user,
        );
      }
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
      })
      .addCase(changeServerName.pending, (state) => {
        state.error = '';
      })
      .addCase(changeServerName.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(changeServerName.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(changeNameOnServer.pending, (state) => {
        state.error = '';
      })
      .addCase(changeNameOnServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(changeNameOnServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteUserFromServer.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteUserFromServer.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(deleteUserFromServer.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(changeChannelName.pending, (state) => {
        state.error = '';
      })
      .addCase(changeChannelName.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(changeChannelName.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(selfMute.pending, (state) => {
        state.error = '';
      })
      .addCase(selfMute.fulfilled, (state) => {
        state.error = '';
      })
      .addCase(selfMute.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addMatcher(
        isAnyOf(getChannelSettings.fulfilled),
        (state, action: PayloadAction<GetChannelSettings>) => {
          state.roleSettings = action.payload;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          getChannelSettings.pending,
          changeTextChannelSettings.pending,
          changeVoiceChannelSettings.pending,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          changeTextChannelSettings.fulfilled,
          changeVoiceChannelSettings.fulfilled,
        ),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          getChannelSettings.rejected,
          changeTextChannelSettings.rejected,
          changeVoiceChannelSettings.rejected,
        ),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
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
  setNewServerName,
  setNewUserName,
  removeUser,
  removeServer,
  editChannelName,
  addUserOnVoiceChannel,
  removeUserFromVoiceChannel,
  toggleUserMuteStatus,
} = testServerSlice.actions;

export const ServerReducer = testServerSlice.reducer;
