import { createAsyncThunk } from '@reduxjs/toolkit';

import { ChatsAPI } from './api/Chats';
import { Chat, ChatInfo, GetChatMessages, GetChats } from './ChatsStore.types';

export const createChat = createAsyncThunk<
  Chat,
  { accessToken: string; userTag: string },
  { rejectValue: string }
>(
  'chatsSlice/createChat',
  async ({ accessToken, userTag }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.createChat(accessToken, userTag);

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const changeChatName = createAsyncThunk<
  void,
  { accessToken: string; chatId: string; name: string },
  { rejectValue: string }
>(
  'chatsSlice/changeChatName',
  async ({ accessToken, chatId, name }, { rejectWithValue }) => {
    try {
      await ChatsAPI.changeChatName(accessToken, chatId, name);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getChats = createAsyncThunk<
  GetChats,
  { accessToken: string },
  { rejectValue: string }
>('chatsSlice/getChats', async ({ accessToken }, { rejectWithValue }) => {
  try {
    const response = await ChatsAPI.getChats(accessToken);

    return response;
  } catch (e) {
    return rejectWithValue(
      e instanceof Error ? e.message : 'Неизвестная ошибка',
    );
  }
});

export const getChatInfo = createAsyncThunk<
  ChatInfo,
  { accessToken: string; chatId: string },
  { rejectValue: string }
>(
  'chatsSlice/getChatInfo',
  async ({ accessToken, chatId }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.getChatInfo(accessToken, chatId);

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getChatMessages = createAsyncThunk<
  GetChatMessages,
  { accessToken: string; chatId: string; number: number; fromStart: number },
  { rejectValue: string }
>(
  'chatsSlice/getChatMessages',
  async ({ accessToken, chatId, number, fromStart }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.getChatMessages(
        accessToken,
        chatId,
        number,
        fromStart,
      );

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const getMoreChatMessages = createAsyncThunk<
  GetChatMessages,
  { accessToken: string; chatId: string; number: number; fromStart: number },
  { rejectValue: string }
>(
  'chatsSlice/getMoreChatMessages',
  async ({ accessToken, chatId, number, fromStart }, { rejectWithValue }) => {
    try {
      const response = await ChatsAPI.getChatMessages(
        accessToken,
        chatId,
        number,
        fromStart,
      );

      return response;
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const addUserInChat = createAsyncThunk<
  void,
  { accessToken: string; chatId: string; userTag: string },
  { rejectValue: string }
>(
  'chatsSlice/addUserInChat',
  async ({ accessToken, chatId, userTag }, { rejectWithValue }) => {
    try {
      await ChatsAPI.addUserInChat(accessToken, chatId, userTag);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);

export const goOutFromChat = createAsyncThunk<
  void,
  { accessToken: string; id: string },
  { rejectValue: string }
>(
  'chatsSlice/goOutFromChat',
  async ({ accessToken, id }, { rejectWithValue }) => {
    try {
      await ChatsAPI.goOutFromChat(accessToken, id);
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : 'Неизвестная ошибка',
      );
    }
  },
);
