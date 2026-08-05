import { Request, Response } from "express";
import prisma from "../config/db";
import { createResponse } from "../utils/response";
import { ApiResponse, Order, OrderStatus } from "../types";

function toOrder(row: {
  id: string;
  status: string;
  total: unknown;
  createdAt: Date;
  userId: string;
  items: { id: string; quantity: number; price: unknown; productId: string }[];
}): Order {
  return {
    id: row.id,
    status: row.status as OrderStatus,
    total: Number(row.total),
    createdAt: row.createdAt,
    userId: row.userId,
    items: row.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      price: Number(i.price),
      productId: i.productId,
    })),
  };
}

// POST /api/orders/checkout (auth required) - converts current cart into an order
export async function checkout(
  req: Request,
  res: Response<ApiResponse<Order>>
): Promise<void> {
  const userId: string = req.user!.userId;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    res.status(400).json(createResponse<Order>(false, undefined, "Cart is empty"));
    return;
  }

  // Verify stock availability before committing
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      res
        .status(400)
        .json(createResponse<Order>(false, undefined, `Not enough stock for ${item.product.name}`));
      return;
    }
  }

  const total: number = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock for each purchased product
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear the cart
    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  res.status(201).json(createResponse<Order>(true, toOrder(order)));
}

// GET /api/orders (auth required) - current user's order history
export async function listOrders(
  req: Request,
  res: Response<ApiResponse<Order[]>>
): Promise<void> {
  const userId: string = req.user!.userId;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(createResponse<Order[]>(true, orders.map(toOrder)));
}
