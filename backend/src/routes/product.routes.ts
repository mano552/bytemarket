import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { Role } from "../types";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", requireAuth, requireRole(Role.Admin), createProduct);
router.patch("/:id", requireAuth, requireRole(Role.Admin), updateProduct);
router.delete("/:id", requireAuth, requireRole(Role.Admin), deleteProduct);

export default router;
