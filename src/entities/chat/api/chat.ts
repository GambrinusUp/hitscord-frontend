import {
  Chat,
  ChatInfo,
  GetChatMessages,
  GetChats,
} from '~/entities/chat/model/types';
import { api } from '~/shared/api';

export const createChat = async (userTag: string): Promise<Chat> => {
  const { data } = await api.post('/chat/create', { userTag });

  return data;
};

export const changeChatName = async (
  chatId: string,
  name: string,
): Promise<void> => {
  await api.put('/chat/name', { chatId, name });
};

export const getChats = async (): Promise<GetChats> => {
  const { data } = await api.get('/chat/list');

  return data;
};

export const getChatInfo = async (chatId: string): Promise<ChatInfo> => {
  const { data } = await api.get('/chat/info', { params: { id: chatId } });

  return data;
};

export const getChatMessages = async (
  chatId: string,
  number: number,
  fromStart: number,
): Promise<GetChatMessages> => {
  const { data } = await api.get('/chat/messages', {
    params: { chatId, number, fromStart },
  });

  return data;
};

export const addUserInChat = async (
  chatId: string,
  userTag: string,
): Promise<void> => {
  await api.put('/chat/add', { chatId, userTag });
};

export const goOutFromChat = async (id: string): Promise<void> => {
  await api.delete('/chat/goout', { data: { id } });
};
