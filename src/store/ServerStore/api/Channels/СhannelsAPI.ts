import { API_URL } from '~/constants';
import {
  ChannelMessage,
  ChannelSettings,
  ChannelType,
  GetChannelSettings,
} from '~/store/ServerStore';

export const getChannelsMessages = async (
  accessToken: string,
  channelId: string,
  numberOfMessages: number,
  fromStart: number = 0,
): Promise<ChannelMessage[]> => {
  try {
    const response = await fetch(
      `${API_URL}/api/channel/messages?channelId=${channelId}&number=${numberOfMessages}&fromStart=${fromStart}`,
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
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data.messages;
  } catch (error) {
    console.error('Error get messages:', error);
    throw error;
  }
};

export const createChannel = async (
  accessToken: string,
  serverId: string,
  name: string,
  channelType: ChannelType,
) => {
  try {
    const response = await fetch(`${API_URL}/api/channel/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverId: serverId,
        name: name,
        channelType: channelType,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error create channel:', error);
    throw error;
  }
};

export const deleteChannel = async (accessToken: string, channelId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/channel/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId: channelId,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error delete channel:', error);
    throw error;
  }
};

export const changeChannelName = async (
  accessToken: string,
  id: string,
  name: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/channel/name/change`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error change channel name:', error);
    throw error;
  }
};

export const selfMute = async (accessToken: string) => {
  try {
    const response = await fetch(`${API_URL}/api/channel/voice/mute/self`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error self mute:', error);
    throw error;
  }
};

export const changeChannelSettings = async (
  accessToken: string,
  settings: ChannelSettings,
) => {
  try {
    const response = await fetch(`${API_URL}/api/channel/settings/change`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error change channel settings:', error);
    throw error;
  }
};

export const getChannelSettings = async (
  accessToken: string,
  channelId: string,
): Promise<GetChannelSettings> => {
  try {
    const response = await fetch(
      `${API_URL}/api/channel/settings?channelId=${channelId}`,
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
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error get channel settings:', error);
    throw error;
  }
};
