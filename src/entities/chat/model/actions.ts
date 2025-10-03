import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  Chat,
  ChatInfo,
  GetChatMessages,
  GetChats,
  GetMessagesParams,
} from './types';

import { ChatsAPI } from '~/entities/chat/api';

export const createChat = createAsyncThunk<
  Chat,
  { userTag: string },
  { rejectValue: string }
>('chatsSlice/createChat', async ({ userTag }, { rejectWithValue }) => {
  try {
    const response = await ChatsAPI.createChat(userTag);

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const changeChatName = createAsyncThunk<
  void,
  { chatId: string; name: string },
  { rejectValue: string }
>(
  'chatsSlice/changeChatName',
  async ({ chatId, name }, { rejectWithValue }) => {
    try {
      await ChatsAPI.changeChatName(chatId, name);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const getChats = createAsyncThunk<
  GetChats,
  void,
  { rejectValue: string }
>('chatsSlice/getChats', async (_, { rejectWithValue }) => {
  try {
    const response = await ChatsAPI.getChats();

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const getChatInfo = createAsyncThunk<
  ChatInfo,
  { chatId: string },
  { rejectValue: string }
>('chatsSlice/getChatInfo', async ({ chatId }, { rejectWithValue }) => {
  try {
    const response = await ChatsAPI.getChatInfo(chatId);

    return response;
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});

export const getChatMessages = createAsyncThunk<
  GetChatMessages,
  GetMessagesParams,
  { rejectValue: string }
>(
  'chatsSlice/getChatMessages',
  async ({ chatId, number, fromMessageId, down }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.getChatMessages(
        chatId,
        number,
        fromMessageId,
        down,
      );

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const getMoreChatMessages = createAsyncThunk<
  GetChatMessages,
  GetMessagesParams,
  { rejectValue: string }
>(
  'chatsSlice/getMoreChatMessages',
  async ({ chatId, number, fromMessageId, down }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.getChatMessages(
        chatId,
        number,
        fromMessageId,
        down,
      );

      return response;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const addUserInChat = createAsyncThunk<
  void,
  { chatId: string; userTag: string },
  { rejectValue: string }
>(
  'chatsSlice/addUserInChat',
  async ({ chatId, userTag }, { rejectWithValue }) => {
    try {
      await ChatsAPI.addUserInChat(chatId, userTag);
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
      }

      return rejectWithValue('Произошла ошибка');
    }
  },
);

export const goOutFromChat = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: string }
>('chatsSlice/goOutFromChat', async ({ id }, { rejectWithValue }) => {
  try {
    await ChatsAPI.goOutFromChat(id);
  } catch (e) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || 'Произошла ошибка');
    }

    return rejectWithValue('Произошла ошибка');
  }
});
