import express from "express";
import {
  getMyCart,
  removeCartItem,
  upsertCartItem,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyCart);
router.post("/", upsertCartItem);
router.delete("/:productId", removeCartItem);

export default router;
