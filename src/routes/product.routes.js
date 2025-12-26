import express from "express";
import {
  getCategories,
  getProductById,
  getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

export default router;
