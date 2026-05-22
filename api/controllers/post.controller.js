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
    // 1. Fail-safe fallback check to ensure middleware populated req.user safely
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing identity profile context" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const currentUserId = req.user.id;
    const userIndex = post.likes.indexOf(currentUserId);

    if (userIndex === -1) {
      post.likes.push(currentUserId);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();

    // 2. Return the exact state signature your frontend layout expects
    res.status(200).json({
      success: true,
      likes: post.likes // Frontend reads this array to calculate count lengths or active flags
    });
  } catch (error) {
    next(error);
  }
};

// 1. Fetch a single post by its MongoDB Object ID 
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(handleError(404, 'Post not found'));
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};


export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(handleError(404, 'Post not found'));
    }

    // Authorization Guard: Requesting user must be the author OR an admin
    if (post.author.toString() !== req.params.userId && req.user.role !== 'admin') {
      return next(handleError(403, 'You are not authorized to edit this post'));
    }

    let updateFields = {
      title: req.body.title,
      category: req.body.category,
      content: req.body.content,
    };

    // If a new binary image asset file is present, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog_posts',
      });
      updateFields.featuredImage = result.secure_url;
    }

    // Regenerate a valid post slug if the author changed the text of the title
    if (req.body.title) {
      updateFields.slug = req.body.title
        .toLowerCase()
        .trim()
        .split(' ')
        .join('-')
        .replace(/[^a-zA-Z0-9-]/g, '') + '-' + Math.random().toString(36).slice(-5);
    }

    // Save modifications to MongoDB using the clean { new: true } return option
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deletePostUser = async (req, res, next) => {
  try {
    // 1. Locate the targeted article document post instance
    const post = await Post.findById(req.params.postId);
    if (!post) return next(handleError(404, 'Post not found'));

    // 2. Validate authority: User must be the author OR an admin
    if (post.author.toString() !== req.params.userId && req.user.role !== 'admin') {
      return next(handleError(403, 'You are not authorized to delete this post'));
    }

    // 3. Clear from collection schema matching index records
    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({
      success: true,
      message: 'The post has been deleted successfully.',
    });
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