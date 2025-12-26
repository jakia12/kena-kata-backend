import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0, min: 0 }, // optional “was price”
    category: { type: String, required: true, trim: true, lowercase: true },

    images: [{ type: String, required: true }],

    brand: { type: String, default: "" },
    sku: { type: String, default: "" },

    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },

    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },

    tags: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
