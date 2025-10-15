import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import {
  addUserInChat,
  changeChatName,
  createChat,
  getChatInfo,
  getChatMessages,
  getChats,
  getMoreChatMessages,
  goOutFromChat,
} from './ChatsStore.actions';
import {
  Chat,
  ChatInfo,
  ChatMessage,
  ChatsState,
  GetChatMessages,
  GetChats,
} from './ChatsStore.types';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { LoadingState } from '~/shared';

const initialState: ChatsState = {
  chatsList: [],
  chatsLoading: LoadingState.IDLE,
  error: '',
  chat: {
    chatId: '',
    chatName: '',
    users: [],
  },
  activeChat: null,
  chatLoading: LoadingState.IDLE,
  messages: [],
  messagesStatus: LoadingState.IDLE,
  messageIsLoading: LoadingState.IDLE,
  numberOfStarterMessage: 0,
  remainingMessagesCount: MAX_MESSAGE_NUMBER,
};

export const ChatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChat = action.payload;
      state.error = '';
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { channelId } = action.payload;

      if (channelId === state.activeChat) {
        state.messages.push(action.payload);
        //state.hasNewMessage = true;
      }
    },
    deleteChatMessageWS: (
      state,
      action: PayloadAction<{ chatId: string; messageId: number }>,
    ) => {
      if (state.activeChat === action.payload.chatId) {
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload.messageId,
        );
      }
    },
    editChatMessageWS: (state, action: PayloadAction<ChatMessage>) => {
      if (state.activeChat === action.payload.channelId) {
        const index = state.messages.findIndex(
          (message) => message.id === action.payload.id,
        );

        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChat.pending, (state) => {
        state.error = '';
      })
      .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chatsList = [...state.chatsList, action.payload];
        state.error = '';
      })
      .addCase(createChat.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(changeChatName.pending, (state) => {
        state.error = '';
      })
      .addCase(changeChatName.fulfilled, (state, { meta }) => {
        const { chatId, name } = meta.arg;

        state.chatsList = state.chatsList.map((chat) =>
          chat.chatId === chatId ? { ...chat, name } : chat,
        );

        if (state.chat.chatId === chatId) {
          state.chat.chatName = name;
        }

        state.error = '';
      })
      .addCase(changeChatName.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(getChats.pending, (state) => {
        state.error = '';
        state.chatsList = [];
        state.chatsLoading = LoadingState.PENDING;
      })
      .addCase(getChats.fulfilled, (state, action: PayloadAction<GetChats>) => {
        state.chatsList = action.payload.chatsList;
        state.chatsLoading = LoadingState.FULFILLED;
        state.error = '';
      })
      .addCase(getChats.rejected, (state, action) => {
        state.chatsLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })

      .addCase(getChatInfo.pending, (state) => {
        state.error = '';
        state.chatLoading = LoadingState.PENDING;
      })
      .addCase(
        getChatInfo.fulfilled,
        (state, action: PayloadAction<ChatInfo>) => {
          state.chat = action.payload;
          state.chatLoading = LoadingState.FULFILLED;
          state.error = '';
        },
      )
      .addCase(getChatInfo.rejected, (state, action) => {
        state.chatLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })

      .addCase(getChatMessages.pending, (state) => {
        state.messagesStatus = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(
        getChatMessages.fulfilled,
        (state, action: PayloadAction<GetChatMessages>) => {
          state.messages = action.payload.messages;
          // state.hasNewMessage = false;
          state.messagesStatus = LoadingState.FULFILLED;
          state.remainingMessagesCount = action.payload.remainingMessagesCount;

          if (action.payload.remainingMessagesCount > 0) {
            state.numberOfStarterMessage = MAX_MESSAGE_NUMBER;
          }
          state.error = '';
        },
      )
      .addCase(getChatMessages.rejected, (state, action) => {
        state.messagesStatus = LoadingState.REJECTED;
        state.error = action.payload as string;
      })
      .addCase(getMoreChatMessages.pending, (state) => {
        state.messageIsLoading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(
        getMoreChatMessages.fulfilled,
        (state, action: PayloadAction<GetChatMessages>) => {
          state.messages = [...action.payload.messages, ...state.messages];
          state.messageIsLoading = LoadingState.FULFILLED;
          state.remainingMessagesCount = action.payload.remainingMessagesCount;

          if (action.payload.remainingMessagesCount > 0) {
            state.numberOfStarterMessage =
              state.numberOfStarterMessage + MAX_MESSAGE_NUMBER;
          }
          state.error = '';
        },
      )
      .addCase(getMoreChatMessages.rejected, (state, action) => {
        state.messageIsLoading = LoadingState.REJECTED;
        state.error = action.payload as string;
      })

      .addCase(goOutFromChat.fulfilled, (state, { meta }) => {
        const chatId = meta.arg.id;
        state.chatsList = state.chatsList.filter(
          (chat) => chat.chatId !== chatId,
        );
        state.error = '';
      })

      .addMatcher(
        isAnyOf(addUserInChat.pending, goOutFromChat.pending),
        (state) => {
          state.error = '';
        },
      )
      .addMatcher(isAnyOf(addUserInChat.fulfilled), (state) => {
        state.error = '';
      })
      .addMatcher(
        isAnyOf(addUserInChat.rejected, goOutFromChat.rejected),
        (state, action) => {
          state.error = action.payload as string;
        },
      );
  },
});

export const {
  setActiveChat,
  addChatMessage,
  deleteChatMessageWS,
  editChatMessageWS,
} = ChatsSlice.actions;

export const ChatsReducer = ChatsSlice.reducer;
