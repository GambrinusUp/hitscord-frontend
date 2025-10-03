import { AxiosError } from 'axios';
import { ReactNode, useEffect, useState } from 'react';

import { clearTokens, refreshTokens } from '~/entities/user';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { api } from '~/shared/api';
import { TokenType } from '~/shared/lib/types';

const EXCLUDED_FROM_ACCESS_TOKEN = [
  '/auth/registration',
  '/auth/login',
  '/auth/refresh',
  '/auth/logout',
];

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

type Props = {
  children: ReactNode;
};

export const ApiProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const { accessToken, refreshToken } = useAppSelector(
    (state) => state.userStore,
  );

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const url = config.url || '';

      if (!EXCLUDED_FROM_ACCESS_TOKEN.includes(url)) {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config!;

        if (
          error.response?.status === 401 &&
          refreshToken &&
          !originalRequest.url?.includes('/refresh')
        ) {
          console.log(accessToken, localStorage.getItem(TokenType.ACCESS));

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                resolve: (token) => {
                  if (token && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  resolve(api(originalRequest));
                },
                reject,
              });
            });
          }

          isRefreshing = true;

          try {
            const response = await dispatch(
              refreshTokens({ refreshToken }),
            ).unwrap();

            localStorage.setItem(TokenType.ACCESS, response.accessToken);
            localStorage.setItem(TokenType.REFRESH, response.refreshToken);

            api.defaults.headers.common.Authorization = `Bearer ${response.accessToken}`;
            processQueue(null, response.accessToken);

            return api(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            dispatch(clearTokens());
            localStorage.setItem(TokenType.ACCESS, '');
            localStorage.setItem(TokenType.REFRESH, '');

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );

    setIsInitialized(true);

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);

  if (!isInitialized) return null;

  return <>{children}</>;
};
