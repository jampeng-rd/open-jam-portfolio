export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  userName: string;
  email: string;
  roles: string[];
  token: string;
}

export interface CurrentUser {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
}