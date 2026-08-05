import React, { createContext, useContext, useState, useCallback } from "react";
import type { CartItemWithProduct, Order } from "../types";
import { apiRequest } from "../api/client";
import { useAuth } from "./AuthContext";

interface CartContextValue {
  items: CartItemWithProduct[];
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  checkout: () => Promise<Order | null>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshCart = useCallback(async (): Promise<void> => {
    if (!token) return;
    setLoading(true);
    const res = await apiRequest<CartItemWithProduct[]>("/cart", { token });
    if (res.success && res.data) {
      setItems(res.data);
    }
    setLoading(false);
  }, [token]);

  async function addToCart(productId: string, quantity: number = 1): Promise<void> {
    if (!token) return;
    await apiRequest<CartItemWithProduct>("/cart", {
      method: "POST",
      token,
      body: { productId, quantity },
    });
    await refreshCart();
  }

  async function removeFromCart(productId: string): Promise<void> {
    if (!token) return;
    await apiRequest<null>(`/cart/${productId}`, { method: "DELETE", token });
    await refreshCart();
  }

  async function checkout(): Promise<Order | null> {
    if (!token) return null;
    const res = await apiRequest<Order>("/orders/checkout", { method: "POST", token });
    if (res.success && res.data) {
      setItems([]);
      return res.data;
    }
    return null;
  }

  return (
    <CartContext.Provider value={{ items, loading, refreshCart, addToCart, removeFromCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
