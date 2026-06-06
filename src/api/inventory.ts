import client from "./client";
import {
  InventoryRecord,
  CreateInventoryRequest,
  UpdateInventoryRequest,
} from "@/types/inventory.types";
import { PaginatedResponse } from "@/types/user.types";

export const getInventory = async (
  page = 0,
  size = 20
): Promise<PaginatedResponse<InventoryRecord>> => {
  const response = await client.get<PaginatedResponse<InventoryRecord>>(
    `/inventory?page=${page}&size=${size}`
  );
  return response.data;
};

export const getInventoryById = async (
  id: number
): Promise<InventoryRecord> => {
  const response = await client.get<InventoryRecord>(`/inventory/${id}`);
  return response.data;
};

export const getInventoryByProduct = async (
  productId: number
): Promise<InventoryRecord[]> => {
  const response = await client.get<InventoryRecord[]>(
    `/inventory/product/${productId}`
  );
  return response.data;
};

export const createInventory = async (
  data: CreateInventoryRequest
): Promise<InventoryRecord> => {
  const response = await client.post<InventoryRecord>("/inventory", data);
  return response.data;
};

export const updateInventory = async (
  id: number,
  data: UpdateInventoryRequest
): Promise<InventoryRecord> => {
  const response = await client.patch<InventoryRecord>(
    `/inventory/${id}`,
    data
  );
  return response.data;
};

export const deleteInventory = async (id: number): Promise<void> => {
  await client.delete(`/inventory/${id}`);
};
