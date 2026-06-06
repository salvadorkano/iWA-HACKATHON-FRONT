export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface AuthUser {
  username: string;
  role: Role;
}
