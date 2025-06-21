import { API_URL } from '~/constants';
import {
  ChangeSettings,
  CreateRoleRequest,
  CreateRoleResponse,
  GetRoles,
  UpdateRole,
} from '~/store/RolesStore/RolesStore.types';

export const getRoles = async (
  accessToken: string,
  serverId: string,
): Promise<GetRoles> => {
  try {
    const response = await fetch(
      `${API_URL}/api/roles/list?serverId=${serverId}`,
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
    console.error('Error get roles:', error);
    throw error;
  }
};

export const createRole = async (
  accessToken: string,
  role: CreateRoleRequest,
): Promise<CreateRoleResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/roles/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...role,
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
    console.error('Error create role:', error);
    throw error;
  }
};

export const deleteRole = async (
  accessToken: string,
  serverId: string,
  roleId: string,
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/roles/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverId,
        roleId,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error delete role:', error);
    throw error;
  }
};

export const updateRole = async (
  accessToken: string,
  updatedRole: UpdateRole,
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/roles/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updatedRole,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error update role:', error);
    throw error;
  }
};

export const updateRoleSettings = async (
  accessToken: string,
  updatedRoleSettings: ChangeSettings,
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/roles/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...updatedRoleSettings,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error update role settings:', error);
    throw error;
  }
};
