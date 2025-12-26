import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/products
 * Query: ?page=1&limit=12&category=fruits&q=apple&sort=latest
 */
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit || "12", 10), 1),
    50
  );

  const { category, q, sort } = req.query;

  const filter = { isActive: true };

  if (category) filter.category = String(category).toLowerCase();

  if (q) {
    filter.$text = { $search: String(q) };
  }

  let sortOption = { createdAt: -1 }; // latest
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items,
  });
});

/**
 * GET /api/products/:id
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/**
 * GET /api/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category", { isActive: true });

  res.status(200).json({
    success: true,
    categories: categories.sort(),
  });
});
