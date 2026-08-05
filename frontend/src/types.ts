export enum Role {
  Admin = "ADMIN",
  Customer = "CUSTOMER",
}

export interface Category {
  id: string;
  name: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId: string;
}

export interface CartItemWithProduct {
  id: string;
  quantity: number;
  productId: string;
  userId: string;
  product: Product;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;
