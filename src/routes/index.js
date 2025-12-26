import express from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount feature routes
router.use("/auth", authRoutes);
router.use("/products", productRoutes);

export default router;
