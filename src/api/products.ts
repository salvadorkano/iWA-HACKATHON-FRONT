import client from "./client";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/product.types";
import { PaginatedResponse } from "@/types/user.types";

export const getProducts = async (
  page = 0,
  size = 20
): Promise<PaginatedResponse<Product>> => {
  const response = await client.get<PaginatedResponse<Product>>(
    `/products?page=${page}&size=${size}`
  );
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await client.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  const response = await client.post<Product>("/products", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductRequest
): Promise<Product> => {
  const response = await client.patch<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await client.delete(`/products/${id}`);
};
