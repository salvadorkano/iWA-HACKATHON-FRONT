import client from "./client";
import { LoginRequest, LoginResponse } from "@/types/auth.types";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await client.post<LoginResponse>("/auth/login", data);
  return response.data;
};
