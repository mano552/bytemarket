import { Request, Response } from "express";
import prisma from "../config/db";
import { createResponse } from "../utils/response";
import {
  ApiResponse,
  PaginatedResponse,
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../types";

function toProduct(p: {
  id: string;
  name: string;
  description: string;
  price: unknown;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
}): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price), // Prisma Decimal -> number
    stock: p.stock,
    imageUrl: p.imageUrl,
    categoryId: p.categoryId,
  };
}

// GET /api/products?page=1&pageSize=10&search=phone&categoryId=xyz
export async function listProducts(
  req: Request,
  res: Response<ApiResponse<PaginatedResponse<Product>>>
): Promise<void> {
  const page: number = Number(req.query.page) || 1;
  const pageSize: number = Number(req.query.pageSize) || 20;
  const search: string | undefined = typeof req.query.search === "string" ? req.query.search : undefined;
  const categoryId: string | undefined =
    typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;

  const where = {
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  const result: PaginatedResponse<Product> = {
    items: rows.map(toProduct),
    total,
    page,
    pageSize,
  };

  res.json(createResponse<PaginatedResponse<Product>>(true, result));
}

// GET /api/products/:id
export async function getProduct(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Product>>
): Promise<void> {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });

  if (!product) {
    res.status(404).json(createResponse<Product>(false, undefined, "Product not found"));
    return;
  }

  res.json(createResponse<Product>(true, toProduct(product)));
}

// POST /api/products (admin only)
export async function createProduct(
  req: Request<{}, {}, CreateProductDTO>,
  res: Response<ApiResponse<Product>>
): Promise<void> {
  const { name, description, price, stock, categoryId, imageUrl } = req.body;

  if (!name || !description || price == null || stock == null || !categoryId) {
    res.status(400).json(createResponse<Product>(false, undefined, "Missing required fields"));
    return;
  }

  const product = await prisma.product.create({
    data: { name, description, price, stock, categoryId, imageUrl },
  });

  res.status(201).json(createResponse<Product>(true, toProduct(product)));
}

// PATCH /api/products/:id (admin only)
export async function updateProduct(
  req: Request<{ id: string }, {}, UpdateProductDTO>,
  res: Response<ApiResponse<Product>>
): Promise<void> {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json(createResponse<Product>(true, toProduct(product)));
}

// DELETE /api/products/:id (admin only)
export async function deleteProduct(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>
): Promise<void> {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json(createResponse<null>(true, null, "Product deleted"));
}
