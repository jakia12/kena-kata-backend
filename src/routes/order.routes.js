import express from "express";
import {
  createOrderFromCart,
  getMyOrders,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrderFromCart);
router.get("/my", getMyOrders);

export default router;
