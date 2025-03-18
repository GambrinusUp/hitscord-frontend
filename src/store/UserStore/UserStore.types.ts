export interface UserState {
  user: User;
  roomName: string;
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  error: string;
  isLoading: boolean;
}

export interface User {
  id: string;
  name: string;
  tag: string;
  mail: string;
  accontCreateDate: string;
}

export interface LoginCredentials {
  mail: string;
  password: string;
}

export interface RegisterCredentials {
  mail: string;
  password: string;
  accountName: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
