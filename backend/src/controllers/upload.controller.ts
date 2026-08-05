import { Request, Response } from "express";
import { createResponse } from "../utils/response";
import { ApiResponse } from "../types";

interface UploadResult {
  imageUrl: string;
}

export async function uploadImage(
  req: Request,
  res: Response<ApiResponse<UploadResult>>
): Promise<void> {
  if (!req.file) {
    res.status(400).json(createResponse<UploadResult>(false, undefined, "No image file provided"));
    return;
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json(createResponse<UploadResult>(true, { imageUrl }));
}
