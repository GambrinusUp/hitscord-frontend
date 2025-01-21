import { API_URL } from '../utils/constants';
import { GetServersResponse, ServerData } from '../utils/types';

const getServers = async (accessToken: string): Promise<GetServersResponse> => {
  try {
    const response = await fetch(`${API_URL}/user/getservers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error get servers:', error);
    throw error;
  }
};

const getServerData = async (
  accessToken: string,
  serverId: string
): Promise<ServerData> => {
  try {
    const response = await fetch(
      `${API_URL}/user/getserverdata?serverId=${serverId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error get server data:', error);
    throw error;
  }
};

const createServer = async (accessToken: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/user/createServer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error create server:', error);
    throw error;
  }
};

const deleteServer = async (accessToken: string, serverId: string) => {
  try {
    const response = await fetch(`${API_URL}/user/deleteserver`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverId: serverId,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error delete server:', error);
    throw error;
  }
};

const changeRole = async (
  accessToken: string,
  serverId: string,
  userId: string,
  role: string
) => {
  try {
    const response = await fetch(`${API_URL}/user/changerole`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverId: serverId,
        userId: userId,
        role: role,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error create server:', error);
    throw error;
  }
};

const subscribeToServer = async (
  accessToken: string,
  serverId: string,
  userName: string
) => {
  try {
    const response = await fetch(`${API_URL}/user/subscribetest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverId: serverId,
        userName: userName,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error subscribe to server:', error);
    throw error;
  }
};

const unsubscribeFromServer = async (accessToken: string, serverId: string) => {
  try {
    const response = await fetch(`${API_URL}/user/unsubscribetest`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverId: serverId,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error unsubscribe from server:', error);
    throw error;
  }
};

export const serverAPI = {
  getServers: getServers,
  getServerData: getServerData,
  createServer: createServer,
  deleteServer: deleteServer,
  changeRole: changeRole,
  subscribeToServer: subscribeToServer,
  unsubscribeFromServer: unsubscribeFromServer,
};
