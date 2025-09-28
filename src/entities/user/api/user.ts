import {
  CHANGE_PROFILE,
  CHANGE_SETTINGS,
  GET_PROFILE,
  LOGIN_USER,
  LOGOUT,
  REFRESH,
  REGISTER_USER,
} from './const';

import {
  ChangeProfileData,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  SettingType,
  User,
} from '~/entities/user/model/types';
import { api } from '~/shared/api';

export const registerUser = async (
  registerData: RegisterCredentials,
): Promise<LoginResponse> => {
  const { data } = await api.post(REGISTER_USER, { ...registerData });

  return data;
};

export const loginUser = async (
  loginData: LoginCredentials,
): Promise<LoginResponse> => {
  const { data } = await api.post(LOGIN_USER, { ...loginData });

  return data;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get(GET_PROFILE);

  return data;
};

export const logout = async (): Promise<void> => {
  await api.delete(LOGOUT);
};

export const refresh = async (refreshToken: string): Promise<LoginResponse> => {
  const { data } = await api.post(
    REFRESH,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );

  return data;
};

export const changeSettings = async (type: SettingType): Promise<void> => {
  await api.put(CHANGE_SETTINGS(type));
};

export const changeProfile = async (
  newProfile: ChangeProfileData,
): Promise<User> => {
  const { data } = await api.put(CHANGE_PROFILE, { ...newProfile });

  return data;
};
