import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import multer, { MulterError } from "multer";
import { uploadImage } from "../controllers/upload.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { Role } from "../types";
import { createResponse } from "../utils/response";

const router = Router();

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/",
  requireAuth,
  requireRole(Role.Admin),
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (err: unknown) => {
      if (err instanceof MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE" ? "Image must be 5MB or smaller" : err.message;
        res.status(400).json(createResponse<null>(false, null, message));
        return;
      }
      if (err instanceof Error) {
        res.status(400).json(createResponse<null>(false, null, err.message));
        return;
      }
      next();
    });
  },
  uploadImage
);

export default router;
