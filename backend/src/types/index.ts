// ==================== ENUMS ====================
export enum Role {
  Admin = "ADMIN",
  Customer = "CUSTOMER",
}

export enum OrderStatus {
  Pending = "PENDING",
  Paid = "PAID",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

// ==================== DOMAIN INTERFACES ====================
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed - never returned to client
  role: Role;
  createdAt: Date;
}

// Safe view of a user (no password) - used whenever we send user data to the client
export type PublicUser = Omit<User, "password">;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  userId: string;
}

export interface CartItemWithProduct extends CartItem {
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
  status: OrderStatus;
  total: number;
  createdAt: Date;
  userId: string;
  items: OrderItem[];
}

// ==================== AUTH DTOs ====================
export interface Category {
  id: string;
  name: string;
}

export interface GoogleLoginDTO {
  idToken: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: string;
  role: Role;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
}

// Partial<T> generic utility - every field becomes optional (for PATCH/update requests)
export type UpdateProductDTO = Partial<CreateProductDTO>;

// ==================== GENERICS ====================

// Generic API response wrapper - works for ANY payload type T
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Generic paginated response - wraps a list of T plus pagination metadata
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
