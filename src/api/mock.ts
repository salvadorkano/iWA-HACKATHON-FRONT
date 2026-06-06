import { LoginResponse } from "@/types/auth.types";
import { PaginatedResponse } from "@/types/user.types";
import { User } from "@/types/user.types";
import { Product } from "@/types/product.types";
import { InventoryRecord } from "@/types/inventory.types";

// Token JWT falso con rol ADMIN
const MOCK_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ.mock";

export const mockLogin = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  await new Promise((r) => setTimeout(r, 500)); // simula latencia
  if (password !== "1234") throw new Error("Credenciales incorrectas");
  const roles: Record<string, string> = {
    admin: "ADMIN",
    gerente: "MANAGER",
    empleado: "EMPLOYEE",
  };
  if (!roles[username]) throw new Error("Usuario no encontrado");
  // Token con rol correcto
  const payload = btoa(
    JSON.stringify({ sub: username, role: roles[username] })
  );
  return { token: `header.${payload}.signature` };
};

export const mockUsers: PaginatedResponse<User> = {
  content: [
    {
      id: 1,
      username: "admin",
      email: "admin@iwa.mx",
      role: "ADMIN",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      username: "gerente",
      email: "gerente@iwa.mx",
      role: "MANAGER",
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      username: "empleado",
      email: "empleado@iwa.mx",
      role: "EMPLOYEE",
      createdAt: "2024-01-01",
    },
  ],
  page: 0,
  size: 20,
  totalElements: 3,
  totalPages: 1,
};

export const mockProducts: PaginatedResponse<Product> = {
  content: [
    {
      id: 1,
      name: "Laptop Dell XPS",
      description: "Laptop de alto rendimiento",
      price: 25000,
      sku: "LAP-001",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: 'Monitor LG 27"',
      description: "Monitor 4K",
      price: 8500,
      sku: "MON-001",
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      name: "Teclado Mecánico",
      description: "Teclado RGB",
      price: 1200,
      sku: "TEC-001",
      createdAt: "2024-01-01",
    },
    {
      id: 4,
      name: "Mouse Logitech",
      description: "Mouse inalámbrico",
      price: 800,
      sku: "MOU-001",
      createdAt: "2024-01-01",
    },
  ],
  page: 0,
  size: 20,
  totalElements: 4,
  totalPages: 1,
};

export const mockInventory: PaginatedResponse<InventoryRecord> = {
  content: [
    {
      id: 1,
      productId: 1,
      productName: "Laptop Dell XPS",
      quantity: 15,
      location: "Almacén A",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      productId: 2,
      productName: 'Monitor LG 27"',
      quantity: 8,
      location: "Almacén B",
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      productId: 3,
      productName: "Teclado Mecánico",
      quantity: 30,
      location: "Almacén A",
      createdAt: "2024-01-01",
    },
    {
      id: 4,
      productId: 4,
      productName: "Mouse Logitech",
      quantity: 25,
      location: "Almacén C",
      createdAt: "2024-01-01",
    },
  ],
  page: 0,
  size: 20,
  totalElements: 4,
  totalPages: 1,
};
