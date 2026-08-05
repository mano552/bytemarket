import { Router } from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:productId", removeFromCart);

export default router;
