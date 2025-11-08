import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ChannelsAPI } from './api/Channels';
import { MessagesAPI } from './api/Messages';
import { ServerAPI } from './api/Server';
import {
  ServerItem,
  ServerData,
  ChannelType,
  ChannelSettings,
  GetChannelSettings,
  GetMessage,
  BannedUserResponse,
} from './ServerStore.types';

import { FileResponse } from '~/entities/files';
import { ERROR_MESSAGES } from '~/shared/constants';
import { RootState } from '~/store/store';

export const getUserServers = createAsyncThunk<
  ServerItem[],
  { accessToken: string },
  { rejectValue: string }
>(
  'testServerSlice/getUserServers',
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await ServerAPI.getServers(accessToken);

      return response.serversList;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getServerData = createAsyncThunk<
  ServerData,
  { accessToken: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/getServerData',
  async ({ accessToken, serverId }, { rejectWithValue }) => {
    try {
      const response = await ServerAPI.getServerData(accessToken, serverId);

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const createServer = createAsyncThunk<
  void,
  { accessToken: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/createServer',
  async ({ accessToken, name }, { rejectWithValue }) => {
    try {
      await ServerAPI.createServer(accessToken, name);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const deleteServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/deleteServer',
  async ({ accessToken, serverId }, { rejectWithValue }) => {
    try {
      await ServerAPI.deleteServer(accessToken, serverId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const changeRole = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userId: string; role: string },
  { rejectValue: string }
>(
  'testServerSlice/changeRole',
  async ({ accessToken, serverId, userId, role }, { rejectWithValue }) => {
    try {
      await ServerAPI.changeRole(accessToken, serverId, userId, role);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const addRole = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userId: string; role: string },
  { rejectValue: string }
>(
  'testServerSlice/addRole',
  async ({ accessToken, serverId, userId, role }, { rejectWithValue }) => {
    try {
      await ServerAPI.addRole(accessToken, serverId, userId, role);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const removeRole = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userId: string; role: string },
  { rejectValue: string }
>(
  'testServerSlice/removeRole',
  async ({ accessToken, serverId, userId, role }, { rejectWithValue }) => {
    try {
      await ServerAPI.removeRole(accessToken, serverId, userId, role);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const subscribeToServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userName: string },
  { rejectValue: string }
>(
  'testServerSlice/subscribeToServer',
  async ({ accessToken, serverId, userName }, { rejectWithValue }) => {
    try {
      await ServerAPI.subscribeToServer(accessToken, serverId, userName);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const unsubscribeFromServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/unsubscribeFromServer',
  async ({ accessToken, serverId }, { rejectWithValue }) => {
    try {
      await ServerAPI.unsubscribeFromServer(accessToken, serverId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getChannelMessages = createAsyncThunk<
  GetMessage,
  {
    accessToken: string;
    channelId: string;
    number: number;
    fromMessageId: number;
    down: boolean;
  },
  { rejectValue: string; state: RootState }
>(
  'testServerSlice/getChannelMessages',
  async (
    { accessToken, channelId, number, fromMessageId, down },
    { rejectWithValue, getState },
  ) => {
    try {
      const response = await ChannelsAPI.getChannelsMessages(
        accessToken,
        channelId,
        number,
        fromMessageId,
        down,
      );

      if (response.messages.length > 0) {
        return response;
      }

      const state = getState();
      const server = state.testServerStore;

      const channel = server.serverData.channels.textChannels.find(
        (c) => c.channelId === channelId,
      );

      const hasUnread =
        (channel?.nonReadedCount ?? 0) > 0 ||
        (channel?.nonReadedTaggedCount ?? 0) > 0;

      const shouldLoadDown =
        !down &&
        fromMessageId !== 0 &&
        response.messages.length === 0 &&
        hasUnread;

      if (shouldLoadDown) {
        const fallbackResponse = await ChannelsAPI.getChannelsMessages(
          accessToken,
          channelId,
          number,
          fromMessageId,
          true,
        );

        return fallbackResponse;
      }

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getMoreMessages = createAsyncThunk<
  GetMessage,
  {
    accessToken: string;
    channelId: string;
    number: number;
    fromMessageId: number;
    down: boolean;
  },
  { rejectValue: string }
>(
  'testServerSlice/getMoreMessages',
  async (
    { accessToken, channelId, number, fromMessageId, down },
    { rejectWithValue },
  ) => {
    try {
      const response = await ChannelsAPI.getChannelsMessages(
        accessToken,
        channelId,
        number,
        fromMessageId,
        down,
      );

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const createMessage = createAsyncThunk<
  void,
  {
    accessToken: string;
    channelId: string;
    text: string;
    nestedChannel: boolean;
  },
  { rejectValue: string }
>(
  'testServerSlice/createMessage',
  async (
    { accessToken, channelId, text, nestedChannel },
    { rejectWithValue },
  ) => {
    try {
      await MessagesAPI.createMessage(
        accessToken,
        channelId,
        text,
        nestedChannel,
      );
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const deleteMessage = createAsyncThunk<
  void,
  {
    accessToken: string;
    messageId: string;
  },
  { rejectValue: string }
>(
  'testServerSlice/deleteMessage',
  async ({ accessToken, messageId }, { rejectWithValue }) => {
    try {
      await MessagesAPI.deleteMessage(accessToken, messageId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const editMessage = createAsyncThunk<
  void,
  {
    accessToken: string;
    messageId: string;
    text: string;
  },
  { rejectValue: string }
>(
  'testServerSlice/editMessage',
  async ({ accessToken, messageId, text }, { rejectWithValue }) => {
    try {
      await MessagesAPI.editMessage(accessToken, messageId, text);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const createChannel = createAsyncThunk<
  void,
  {
    accessToken: string;
    serverId: string;
    name: string;
    channelType: ChannelType;
    maxCount?: number;
  },
  { rejectValue: string }
>(
  'testServerSlice/createChannel',
  async (
    { accessToken, serverId, name, channelType, maxCount },
    { rejectWithValue },
  ) => {
    try {
      await ChannelsAPI.createChannel(
        accessToken,
        serverId,
        name,
        channelType,
        maxCount,
      );
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const deleteChannel = createAsyncThunk<
  void,
  {
    accessToken: string;
    channelId: string;
  },
  { rejectValue: string }
>(
  'testServerSlice/deleteChannel',
  async ({ accessToken, channelId }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.deleteChannel(accessToken, channelId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const changeServerName = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/changeServerName',
  async ({ accessToken, serverId, name }, { rejectWithValue }) => {
    try {
      await ServerAPI.changeServerName(accessToken, serverId, name);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const changeNameOnServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/changeNameOnServer',
  async ({ accessToken, serverId, name }, { rejectWithValue }) => {
    try {
      await ServerAPI.changeNameOnServer(accessToken, serverId, name);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const deleteUserFromServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userId: string; banReason?: string },
  { rejectValue: string }
>(
  'testServerSlice/deleteUserFromServer',
  async ({ accessToken, serverId, userId, banReason }, { rejectWithValue }) => {
    try {
      await ServerAPI.deleteUserFromServer(
        accessToken,
        serverId,
        userId,
        banReason,
      );
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const changeNotificationChannelSettings = createAsyncThunk<
  void,
  { accessToken: string; settings: ChannelSettings },
  { rejectValue: string }
>(
  'testServerSlice/changeNotificationChannelSettings',
  async ({ accessToken, settings }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeNotificationChannelSettings(
        accessToken,
        settings,
      );
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const changeChannelName = createAsyncThunk<
  void,
  { accessToken: string; id: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/changeChannelName',
  async ({ accessToken, id, name }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeChannelName(accessToken, id, name);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const creatorUnsubscribeFromServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; newCreatorId: string },
  { rejectValue: string }
>(
  'testServerSlice/creatorUnsubscribeFromServer',
  async ({ accessToken, serverId, newCreatorId }, { rejectWithValue }) => {
    try {
      await ServerAPI.creatorUnsubscribeFromServer(
        accessToken,
        serverId,
        newCreatorId,
      );
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const selfMute = createAsyncThunk<
  void,
  { accessToken: string },
  { rejectValue: string }
>('testServerSlice/selfMute', async ({ accessToken }, { rejectWithValue }) => {
  try {
    await ChannelsAPI.selfMute(accessToken);
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Неизвестная ошибка',
    );
  }
});

export const changeTextChannelSettings = createAsyncThunk<
  void,
  { accessToken: string; settings: ChannelSettings },
  { rejectValue: string }
>(
  'testServerSlice/changeTextChannelSettings',
  async ({ accessToken, settings }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeTextChannelSettings(accessToken, settings);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getChannelSettings = createAsyncThunk<
  GetChannelSettings,
  { accessToken: string; channelId: string },
  { rejectValue: string }
>(
  'testServerSlice/getChannelSettings',
  async ({ accessToken, channelId }, { rejectWithValue }) => {
    try {
      const response = await ChannelsAPI.getChannelSettings(
        accessToken,
        channelId,
      );

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

/*export const getVoiceChannelSettings = createAsyncThunk<
  GetChannelSettings,
  { accessToken: string; channelId: string },
  { rejectValue: string }
>(
  'testServerSlice/getVoiceChannelSettings',
  async ({ accessToken, channelId }, { rejectWithValue }) => {
    try {
      const response = await ChannelsAPI.getVoiceChannelSettings(
        accessToken,
        channelId,
      );

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);*/

export const changeVoiceChannelSettings = createAsyncThunk<
  void,
  { accessToken: string; settings: ChannelSettings },
  { rejectValue: string }
>(
  'testServerSlice/changeVoiceChannelSettings',
  async ({ accessToken, settings }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeVoiceChannelSettings(accessToken, settings);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getBannedUsers = createAsyncThunk<
  BannedUserResponse,
  { accessToken: string; serverId: string; page: number; size: number },
  { rejectValue: string }
>(
  'testServerSlice/getBannedUsers',
  async ({ accessToken, serverId, page, size }, { rejectWithValue }) => {
    try {
      const response = await ServerAPI.getBannedUsers(
        accessToken,
        serverId,
        page,
        size,
      );

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const unbanUser = createAsyncThunk<
  void,
  { accessToken: string; userId: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/unbanUser',
  async ({ accessToken, userId, serverId }, { rejectWithValue }) => {
    try {
      await ServerAPI.unbanUser(accessToken, userId, serverId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const changeVoiceChannelMaxCount = createAsyncThunk<
  void,
  { accessToken: string; voiceChannelId: string; maxCount: number },
  { rejectValue: string }
>(
  'testServerSlice/changeVoiceChannelMaxCount',
  async ({ accessToken, voiceChannelId, maxCount }, { rejectWithValue }) => {
    try {
      await ChannelsAPI.changeVoiceChannelMaxCount(
        accessToken,
        voiceChannelId,
        maxCount,
      );
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const changeServerIcon = createAsyncThunk<
  FileResponse,
  { serverId: string; icon: File },
  { rejectValue: string }
>(
  'testServerSlice/changeServerIcon',
  async ({ serverId, icon }, { rejectWithValue }) => {
    try {
      const response = await ServerAPI.changeServerIcon(serverId, icon);

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(
          e.response?.data?.message || ERROR_MESSAGES.DEFAULT,
        );
      }

      return rejectWithValue(ERROR_MESSAGES.DEFAULT);
    }
  },
);
