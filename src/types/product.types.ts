export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  sku: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
}
