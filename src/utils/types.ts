export interface User {
  id: string;
  email: string;
  fullName: string;
  course: string;
  group: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
