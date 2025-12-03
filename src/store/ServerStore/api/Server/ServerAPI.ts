import { API_URL } from '~/constants';
import { FileResponse } from '~/entities/files';
import { api } from '~/shared/api';
import {
  BannedUserResponse,
  GetServersResponse,
  ServerData,
} from '~/store/ServerStore';

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

export const createServer = async (
  accessToken: string,
  name: string,
  serverType: number,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        serverType,
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

export const addRole = async (
  accessToken: string,
  serverId: string,
  userId: string,
  role: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/addrole`, {
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

export const removeRole = async (
  accessToken: string,
  serverId: string,
  userId: string,
  role: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/removerole`, {
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

export const changeServerName = async (
  accessToken: string,
  serverId: string,
  name: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/name/server/change`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: serverId,
        name,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error change server name:', error);
    throw error;
  }
};

export const changeNameOnServer = async (
  accessToken: string,
  serverId: string,
  name: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/name/user/change`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: serverId,
        name,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error change user name on server:', error);
    throw error;
  }
};

export const deleteUserFromServer = async (
  accessToken: string,
  serverId: string,
  userId: string,
  banReason?: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/deleteuser`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverId,
        userId,
        banReason,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error delete user from server:', error);
    throw error;
  }
};

export const creatorUnsubscribeFromServer = async (
  accessToken: string,
  serverId: string,
  newCreatorId: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/unsubscribe/creator`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverId,
        newCreatorId,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error unsubscribe creator from server:', error);
    throw error;
  }
};

export const getBannedUsers = async (
  accessToken: string,
  serverId: string,
  page: number,
  size: number,
): Promise<BannedUserResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/api/server/banned/list?serverId=${serverId}&Page=${page}&Size=${size}`,
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
    console.error('Error get banned users:', error);
    throw error;
  }
};

export const unbanUser = async (
  accessToken: string,
  userId: string,
  serverId: string,
) => {
  try {
    const response = await fetch(`${API_URL}/api/server/banned/unban`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        serverId,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error unban user:', error);
    throw error;
  }
};

export const changeServerIcon = async (
  serverId: string,
  icon: File,
): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append('ServerId', serverId);
  formData.append('Icon', icon);

  const { data } = await api.put('/server/icon', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const changeServerIsClosed = async (
  accessToken: string,
  serverId: string,
  isClosed: boolean,
  isApprove?: boolean,
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('ServerId', serverId);
    formData.append('IsClosed', isClosed.toString());

    if (isApprove !== undefined) {
      formData.append('IsApprove', isApprove.toString());
    }

    const response = await fetch(`${API_URL}/api/server/isClosed`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error change server is closed:', error);
    throw error;
  }
};

export const changeNotifiable = async (
  accessToken: string,
  serverId: string,
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/server/settings/nonnotifiable`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: serverId,
        }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error change notifiable:', error);
    throw error;
  }
};
