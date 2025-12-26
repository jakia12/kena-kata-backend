import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/cart
 */
export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title price images category"
  );

  res.status(200).json({
    success: true,
    cart: cart || { user: req.user._id, items: [] },
  });
});

/**
 * POST /api/cart
 * body: { productId, qty }
 * - If item exists -> update qty
 * - Else -> add item
 */
export const upsertCartItem = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty) {
    res.status(400);
    throw new Error("productId and qty are required");
  }

  const safeQty = Math.max(parseInt(qty, 10), 1);

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const idx = cart.items.findIndex(
    (i) => String(i.product) === String(product._id)
  );

  const imageSnapshot =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "";

  if (idx >= 0) {
    cart.items[idx].qty = safeQty;
    // Keep snapshots updated
    cart.items[idx].priceSnapshot = product.price;
    cart.items[idx].titleSnapshot = product.title;
    cart.items[idx].imageSnapshot = imageSnapshot;
  } else {
    cart.items.push({
      product: product._id,
      qty: safeQty,
      priceSnapshot: product.price,
      titleSnapshot: product.title,
      imageSnapshot,
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated",
    cart,
  });
});

/**
 * DELETE /api/cart/:productId
 */
export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res
      .status(200)
      .json({
        success: true,
        message: "Cart is already empty",
        cart: { items: [] },
      });
    return;
  }

  cart.items = cart.items.filter(
    (i) => String(i.product) !== String(productId)
  );
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed",
    cart,
  });
});
