import { API_URL } from '~/constants/constants';
import {
  User,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  SettingType,
  ChangeProfileData,
} from '~/store/UserStore';

export const registerUser = async (
  registerData: RegisterCredentials,
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (
  loginData: LoginCredentials,
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error login user:', error);
    throw error;
  }
};

export const getProfile = async (accessToken: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/profile/get`, {
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
    console.error('Error get profile user:', error);
    throw error;
  }
};

export const logout = async (accessToken: string) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'DELETE',
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
    console.error('Error logout user:', error);
    throw error;
  }
};

export const refreshToken = async (
  refreshToken: string,
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error refresh tokens:', error);
    throw error;
  }
};

export const changeSettings = async (
  accessToken: string,
  type: SettingType,
) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/settings/${type}`, {
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
    console.error('Error change settings:', error);
    throw error;
  }
};

export const changeProfile = async (
  accessToken: string,
  newProfile: ChangeProfileData,
): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/profile/change`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfile),
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
    console.error('Error change user profile:', error);
    throw error;
  }
};
