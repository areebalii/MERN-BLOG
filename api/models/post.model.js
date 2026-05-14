import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      default: "https://via.placeholder.com/800x400",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This MUST match the name of your User model
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    likes: {
      type: Array,
      default: [], 
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;