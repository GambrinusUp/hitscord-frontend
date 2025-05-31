import { API_URL } from '~/constants';
import { GetApplication, GetFriends } from '~/store/UserStore';

export const createApplication = async (
  accessToken: string,
  userTag: string,
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/friendship/application/create`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userTag }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error create application:', error);
    throw error;
  }
};

export const getApplicationFrom = async (
  accessToken: string,
): Promise<GetApplication> => {
  try {
    const response = await fetch(
      `${API_URL}/api/friendship/application/list/from`,
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
    console.error('Error get applications from:', error);
    throw error;
  }
};

export const getApplicationTo = async (
  accessToken: string,
): Promise<GetApplication> => {
  try {
    const response = await fetch(
      `${API_URL}/api/friendship/application/list/to`,
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
    console.error('Error get applications from:', error);
    throw error;
  }
};

export const deleteApplication = async (
  accessToken: string,
  applicationId: string,
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/friendship/application/delete`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error delete application:', error);
    throw error;
  }
};

export const declineApplication = async (
  accessToken: string,
  applicationId: string,
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/friendship/application/decline`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error decline application:', error);
    throw error;
  }
};

export const approveApplication = async (
  accessToken: string,
  applicationId: string,
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/friendship/application/approve`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error approve application:', error);
    throw error;
  }
};

export const deleteFriendship = async (accessToken: string, userId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/api/friendship/delete?UserId=${userId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error delete friendship:', error);
    throw error;
  }
};

export const getFriendshipList = async (
  accessToken: string,
): Promise<GetFriends> => {
  try {
    const response = await fetch(`${API_URL}/api/friendship/list`, {
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
    console.error('Error get friendship list:', error);
    throw error;
  }
};
