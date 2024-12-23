import { createAsyncThunk } from '@reduxjs/toolkit';

import { channelsAPI } from '../../api/channelsAPI';
import { messagesAPI } from '../../api/messagesAPI';
import { serverAPI } from '../../api/serverAPI';
import {
  ChannelMessage,
  ChannelType,
  ServerData,
  ServerItem,
} from '../../utils/types';

export const getUserServers = createAsyncThunk<
  ServerItem[],
  { accessToken: string },
  { rejectValue: string }
>(
  'testServerSlice/getUserServers',
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await serverAPI.getServers(accessToken);
      return response.serversList;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const getServerData = createAsyncThunk<
  ServerData,
  { accessToken: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/getServerData',
  async ({ accessToken, serverId }, { rejectWithValue }) => {
    try {
      const response = await serverAPI.getServerData(accessToken, serverId);
      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const createServer = createAsyncThunk<
  void,
  { accessToken: string; name: string },
  { rejectValue: string }
>(
  'testServerSlice/createServer',
  async ({ accessToken, name }, { rejectWithValue }) => {
    try {
      await serverAPI.createServer(accessToken, name);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const deleteServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string },
  { rejectValue: string }
>(
  'testServerSlice/deleteServer',
  async ({ accessToken, serverId }, { rejectWithValue }) => {
    try {
      await serverAPI.deleteServer(accessToken, serverId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const changeRole = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userId: string; role: string },
  { rejectValue: string }
>(
  'testServerSlice/changeRole',
  async ({ accessToken, serverId, userId, role }, { rejectWithValue }) => {
    try {
      await serverAPI.changeRole(accessToken, serverId, userId, role);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const subscribeToServer = createAsyncThunk<
  void,
  { accessToken: string; serverId: string; userName: string },
  { rejectValue: string }
>(
  'testServerSlice/subscribeToServer',
  async ({ accessToken, serverId, userName }, { rejectWithValue }) => {
    try {
      await serverAPI.subscribeToServer(accessToken, serverId, userName);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const getChannelMessages = createAsyncThunk<
  ChannelMessage[],
  {
    accessToken: string;
    channelId: string;
    numberOfMessages: number;
    fromStart: number;
  },
  { rejectValue: string }
>(
  'testServerSlice/getChannelMessages',
  async (
    { accessToken, channelId, numberOfMessages, fromStart },
    { rejectWithValue }
  ) => {
    try {
      const response = await channelsAPI.getChannelsMessages(
        accessToken,
        channelId,
        numberOfMessages,
        fromStart
      );
      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const createMessage = createAsyncThunk<
  void,
  {
    accessToken: string;
    channelId: string;
    text: string;
  },
  { rejectValue: string }
>(
  'testServerSlice/createMessage',
  async ({ accessToken, channelId, text }, { rejectWithValue }) => {
    try {
      await messagesAPI.createMessage(accessToken, channelId, text);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
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
      await messagesAPI.deleteMessage(accessToken, messageId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
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
      await messagesAPI.editMessage(accessToken, messageId, text);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const createChannel = createAsyncThunk<
  void,
  {
    accessToken: string;
    serverId: string;
    name: string;
    channelType: ChannelType;
  },
  { rejectValue: string }
>(
  'testServerSlice/createChannel',
  async ({ accessToken, serverId, name, channelType }, { rejectWithValue }) => {
    try {
      await channelsAPI.createChannel(accessToken, serverId, name, channelType);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
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
      await channelsAPI.deleteChannel(accessToken, channelId);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка'
      );
    }
  }
);
