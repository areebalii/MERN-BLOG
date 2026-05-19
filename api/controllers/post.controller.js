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

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'name avatar role');
    if (!post) {
      return next(handleError(404, 'Post not found'));
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    // Sort by createdAt -1 to show newest blogs first
    const posts = await Post.find()
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

export const getRelatedPosts = async (req, res, next) => {
  try {
    const { category, currentPostId } = req.query;
    const relatedPosts = await Post.find({
      category: category,
      _id: { $ne: currentPostId } // Exclude the post the user is currently reading
    })
      .limit(3) // Limit to 3 posts
      .select('title featuredImage slug createdAt');

    res.status(200).json({ success: true, relatedPosts });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(handleError(404, 'Post not found'));

    const currentUserId = req.user.id;

    const userIndex = post.likes.indexOf(currentUserId);

    if (userIndex === -1) {
      post.likes.push(currentUserId);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();
    // Return the whole post or just the likes array
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Admin controllers

// Get All Posts (with Pagination & Populated Authors)
export const getAllPosts = async (req, res, next) => {
  try {
    // Fetch posts, populate author metadata, and sort by newest first
    const posts = await Post.find()
      .populate('author', 'name avatar email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Post by Admin
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(handleError(404, 'Post not found'));

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'The post has been deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};