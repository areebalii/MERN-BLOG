import Post from '../models/post.model.js';
import { handleError } from '../helpers/handleError.js';
import cloudinary from '../config/cloudinary.js';

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, author } = req.body;

    if (!req.file) {
      return next(handleError(400, 'Please upload a cover image'));
    }

    // 1. Upload Image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog_posts',
    });

    // 2. Generate Slug (e.g., "Hello World" -> "hello-world-12345")
    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '') + '-' + Math.random().toString(36).slice(-5);

    // 3. Create Post
    const newPost = new Post({
      title,
      content,
      category,
      featuredImage: result.secure_url,
      slug,
      author
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    next(handleError(500, error.message));
  }
};