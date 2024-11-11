import axios from 'axios';

import { API_URL } from '../utils/constants';
import { LoginCredentials, User } from '../utils/types';

const registerUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await axios.post(API_URL + '/users', userData);
    console.log('User registered:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

const loginUser = async (loginData: LoginCredentials): Promise<User> => {
  try {
    const response = await axios.get(
      API_URL + '/users?email=' + loginData.email
    );
    console.log('Login:', response.data);
    if (response.data.length < 1)
      throw new Error('Пароль или почта не правильные');
    return response.data[0];
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const authAPI = {
  registerUser: registerUser,
  loginUser: loginUser,
};
