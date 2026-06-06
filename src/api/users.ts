import client from "./client";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginatedResponse,
} from "@/types/user.types";

export const getUsers = async (
  page = 0,
  size = 20
): Promise<PaginatedResponse<User>> => {
  const response = await client.get<PaginatedResponse<User>>(
    `/users?page=${page}&size=${size}`
  );
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await client.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserRequest): Promise<User> => {
  const response = await client.post<User>("/users", data);
  return response.data;
};

export const updateUser = async (
  id: number,
  data: UpdateUserRequest
): Promise<User> => {
  const response = await client.patch<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await client.delete(`/users/${id}`);
};
