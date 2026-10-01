import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  purpose?: string;
  userData?: any;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["login", "signup", "reset-password"],
      default: "login",
    },
    userData: {
      type: Schema.Types.Mixed,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Otp as mongoose.Model<IOtp>) || mongoose.model<IOtp>("Otp", OtpSchema);
