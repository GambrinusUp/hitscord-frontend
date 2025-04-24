import { API_URL } from '~/constants';
import { GetServersResponse, ServerData } from '~/store/ServerStore';

export const getServers = async (
  accessToken: string,
): Promise<GetServersResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/server/get/List`, {
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

export const getServerData = async (
  accessToken: string,
  serverId: string,
): Promise<ServerData> => {
  try {
    const response = await fetch(
      `${API_URL}/api/server/getserverdata?serverId=${serverId}`,
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
    console.error('Error get server data:', error);
    throw error;
  }
};

export const createServer = async (accessToken: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/api/server/create`, {
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

export const deleteServer = async (accessToken: string, serverId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/server/delete`, {
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

export const changeRole = async (
  accessToken: string,
  serverId: string,
  userId: string,
  role: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/changerole`, {
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

export const subscribeToServer = async (
  accessToken: string,
  serverId: string,
  userName: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/subscribe`, {
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

export const unsubscribeFromServer = async (
  accessToken: string,
  serverId: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/unsubscribe`, {
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
