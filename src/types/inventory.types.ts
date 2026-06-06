export interface InventoryRecord {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  location: string;
  createdAt: string;
}

export interface CreateInventoryRequest {
  productId: number;
  quantity: number;
  location: string;
}

export interface UpdateInventoryRequest {
  quantity?: number;
  location?: string;
}
