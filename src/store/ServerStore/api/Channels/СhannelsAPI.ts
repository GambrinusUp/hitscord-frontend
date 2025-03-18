import { API_URL } from '~/constants';
import { ChannelMessage, ChannelType } from '~/store/ServerStore';

export const getChannelsMessages = async (
  accessToken: string,
  channelId: string,
  numberOfMessages: number,
  fromStart: number = 0,
): Promise<ChannelMessage[]> => {
  try {
    const response = await fetch(
      `${API_URL}/channel/gettextchannelmessages?channelId=${channelId}&number=${numberOfMessages}&fromStart=${fromStart}`,
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
    const response = await fetch(`${API_URL}/channel/createchannel`, {
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
    const response = await fetch(`${API_URL}/channel/deletechannel`, {
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
