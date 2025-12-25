// src/routes/index.js
import express from "express";

const router = express.Router();

/**
 * ===============================
 * Health Check
 * ===============================
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * ===============================
 * Future Routes
 * ===============================
 */
// router.use("/auth", authRoutes);
// router.use("/products", productRoutes);
// router.use("/orders", orderRoutes);

export default router;
