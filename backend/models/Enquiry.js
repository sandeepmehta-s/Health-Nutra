import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },
    subject: {
      type: String,
      trim: true,
      default: "General",
      maxlength: 150,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "resolved"],
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup, filtering, and export
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ email: 1 });

export const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
