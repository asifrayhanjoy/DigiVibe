import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  avatar?: string;
  walletBalance?: number;
  role?: string;
  isVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone / WhatsApp number is required"],
      trim: true,
    },
    whatsapp: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "Dhaka, Bangladesh",
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

