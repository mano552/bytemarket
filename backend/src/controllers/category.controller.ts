import { Request, Response } from "express";
import prisma from "../config/db";
import { createResponse } from "../utils/response";
import { ApiResponse, Category } from "../types";

export async function listCategories(
  req: Request,
  res: Response<ApiResponse<Category[]>>
): Promise<void> {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json(createResponse<Category[]>(true, categories));
}
