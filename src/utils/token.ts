import { AuthUser, Role } from "@/types/auth.types";

const TOKEN_KEY = "token";

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// El JWT tiene 3 partes separadas por "."
// La del medio es el payload en base64
export const decodeToken = (token: string): AuthUser | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      username: payload.sub,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
};
