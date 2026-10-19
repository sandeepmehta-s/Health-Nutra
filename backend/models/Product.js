import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "General",
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    fullDescription: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be a positive number"],
    },
    unit: {
      type: String,
      default: "Strip",
      trim: true,
    },
    image: {
      type: String,
      default: "/uploads/9g.png",
    },
    status: {
      type: String,
      enum: ["active", "hidden"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted price
productSchema.virtual("formattedPrice").get(function () {
  return `₹${this.price.toFixed(2)}`;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
