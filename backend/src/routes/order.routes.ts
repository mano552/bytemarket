import { Router } from "express";
import { checkout, listOrders } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/checkout", checkout);
router.get("/", listOrders);

export default router;
