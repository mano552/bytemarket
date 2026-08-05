import { Request, Response } from "express";
import prisma from "../config/db";
import { createResponse } from "../utils/response";
import { ApiResponse, CartItemWithProduct } from "../types";

interface AddToCartDTO {
  productId: string;
  quantity: number;
}

function toCartItemWithProduct(row: {
  id: string;
  quantity: number;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: unknown;
    stock: number;
    imageUrl: string | null;
    categoryId: string;
  };
}): CartItemWithProduct {
  return {
    id: row.id,
    quantity: row.quantity,
    userId: row.userId,
    productId: row.productId,
    product: {
      id: row.product.id,
      name: row.product.name,
      description: row.product.description,
      price: Number(row.product.price),
      stock: row.product.stock,
      imageUrl: row.product.imageUrl,
      categoryId: row.product.categoryId,
    },
  };
}

// GET /api/cart (auth required)
export async function getCart(
  req: Request,
  res: Response<ApiResponse<CartItemWithProduct[]>>
): Promise<void> {
  const userId: string = req.user!.userId; // requireAuth guarantees req.user exists

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  res.json(createResponse<CartItemWithProduct[]>(true, items.map(toCartItemWithProduct)));
}

// POST /api/cart (auth required)
export async function addToCart(
  req: Request<{}, {}, AddToCartDTO>,
  res: Response<ApiResponse<CartItemWithProduct>>
): Promise<void> {
  const userId: string = req.user!.userId;
  const { productId, quantity } = req.body;

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity ?? 1 } },
    create: { userId, productId, quantity: quantity ?? 1 },
    include: { product: true },
  });

  res.status(201).json(createResponse<CartItemWithProduct>(true, toCartItemWithProduct(item)));
}

// DELETE /api/cart/:productId (auth required)
export async function removeFromCart(
  req: Request<{ productId: string }>,
  res: Response<ApiResponse<null>>
): Promise<void> {
  const userId: string = req.user!.userId;

  await prisma.cartItem.delete({
    where: { userId_productId: { userId, productId: req.params.productId } },
  });

  res.json(createResponse<null>(true, null, "Item removed from cart"));
}
