import mongoose, { Schema } from "mongoose";

const CardItemSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  badge: { type: String, default: "" },
  linkUrl: { type: String, default: "" },
});

const FileItemSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String, default: "" },
  type: { type: String, default: "attachment" },
});

const UpdateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Daily Announcement",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    badgeText: {
      type: String,
      default: "NEW UPDATE",
    },
    cards: {
      type: [CardItemSchema],
      default: [],
    },
    files: {
      type: [FileItemSchema],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      default: "Master Admin",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Update || mongoose.model("Update", UpdateSchema);
