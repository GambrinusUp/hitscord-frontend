import { API_URL } from '~/constants';
import {
  Chat,
  ChatInfo,
  GetChatMessages,
  GetChats,
} from '~/store/ChatsStore/ChatsStore.types';

export const createChat = async (
  accessToken: string,
  userTag: string,
): Promise<Chat> => {
  try {
    const response = await fetch(`${API_URL}/api/chat/list`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userTag,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'Unknown error',
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error('Error create chat:', error);
    throw error;
  }
};

export const changeChatName = async (
  accessToken: string,
  chatId: string,
  name: string,
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/chat/name`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        name,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error change chat name:', error);
    throw error;
  }
};

export const getChats = async (accessToken: string): Promise<GetChats> => {
  try {
    const response = await fetch(`${API_URL}/api/chat/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'Unknown error',
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error('Error get chats:', error);
    throw error;
  }
};

export const getChatInfo = async (
  accessToken: string,
  chatId: string,
): Promise<ChatInfo> => {
  try {
    const response = await fetch(`${API_URL}/api/chat/info?id=${chatId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'Unknown error',
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error('Error get chat info:', error);
    throw error;
  }
};

export const getChatMessages = async (
  accessToken: string,
  chatId: string,
  number: number,
  fromStart: number,
): Promise<GetChatMessages> => {
  try {
    const response = await fetch(
      `${API_URL}/api/chat/messages?chatId=${chatId}&number=${number}&fromStart=${fromStart}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'Unknown error',
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error('Error get chat messages:', error);
    throw error;
  }
};

export const addUserInChat = async (
  accessToken: string,
  chatId: string,
  userTag: string,
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/chat/add`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        userTag,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error add user in chat:', error);
    throw error;
  }
};

export const goOutFromChat = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/chat/goout`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error goout from chat:', error);
    throw error;
  }
};
