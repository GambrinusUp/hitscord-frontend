import { API_URL } from '../utils/constants';

const createMessage = async (
  accessToken: string,
  channelId: string,
  text: string,
  nestedChannel: boolean
) => {
  try {
    const response = await fetch(`${API_URL}/message/createmessage`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId: channelId,
        text: text,
        nestedChannel: nestedChannel,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error create message:', error);
    throw error;
  }
};

const deleteMessage = async (accessToken: string, messageId: string) => {
  try {
    const response = await fetch(`${API_URL}/message/deletemessage`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId: messageId,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error delete message:', error);
    throw error;
  }
};

const editMessage = async (
  accessToken: string,
  messageId: string,
  text: string
) => {
  try {
    const response = await fetch(`${API_URL}/message/updatemessage`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId: messageId,
        text: text,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error edit message:', error);
    throw error;
  }
};

export const messagesAPI = {
  createMessage: createMessage,
  deleteMessage: deleteMessage,
  editMessage: editMessage,
};
