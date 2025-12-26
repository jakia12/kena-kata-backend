import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * POST /api/orders
 * Creates an order from the user's cart (simple version: status=pending)
 * Optional body: { shipping, tax }
 */
export const createOrderFromCart = asyncHandler(async (req, res) => {
  const shipping = Math.max(Number(req.body?.shipping || 0), 0);
  const tax = Math.max(Number(req.body?.tax || 0), 0);

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const subtotal = cart.items.reduce(
    (sum, i) => sum + i.priceSnapshot * i.qty,
    0
  );
  const total = subtotal + shipping + tax;

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((i) => ({
      product: i.product,
      qty: i.qty,
      priceSnapshot: i.priceSnapshot,
      titleSnapshot: i.titleSnapshot,
      imageSnapshot: i.imageSnapshot,
    })),
    subtotal,
    shipping,
    tax,
    total,
    status: "pending",
  });

  // Clear cart after order creation (common pattern)
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order created",
    order,
  });
});

/**
 * GET /api/orders/my
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    total: orders.length,
    orders,
  });
});
