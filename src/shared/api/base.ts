import axios from 'axios';

import { TokenType } from '~/shared/lib/types';

const EXCLUDED_FROM_ACCESS_TOKEN = [
  '/auth/registration',
  '/auth/login',
  '/auth/refresh',
];

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const url = config.url || '';

  if (url === '/auth/login') {
    const refreshToken = localStorage.getItem(TokenType.REFRESH);

    if (refreshToken) {
      config.headers.Authorization = `Bearer ${refreshToken}`;
    } else {
      console.warn('No refresh token available for refresh request');
    }

    return config;
  }

  if (EXCLUDED_FROM_ACCESS_TOKEN.includes(url)) {
    return config;
  }

  const accessToken = localStorage.getItem(TokenType.ACCESS);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/*const token = localStorage.getItem(TokenType.ACCESS);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;*/
