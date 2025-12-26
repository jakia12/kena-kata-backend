import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

/**
 * POST /api/auth/register
 * body: { name, email, password }
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  // Check if user exists
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("Email already in use");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
  });

  // Create token
  const token = generateToken({ userId: user._id });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // Find user + include password (since select:false)
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Token
  const token = generateToken({ userId: user._id });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
