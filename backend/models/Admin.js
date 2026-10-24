import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    name: {
      type: String,
      default: "Administrator",
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.password;
    return ret;
  },
});
adminSchema.set("toObject", {
  transform(_doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Hash password before saving if modified
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // If already a valid bcrypt hash, avoid double hashing
  if (/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password)) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

