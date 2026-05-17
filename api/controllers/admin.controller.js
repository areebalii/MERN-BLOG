import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // Run counts concurrently to maximize backend performance
    const [totalPosts, totalUsers, totalComments, recentPosts] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
      Post.find()
        .sort({ createdAt: -1 }) // Get newest first
        .limit(5)                 // Limit to top 5 recent posts
        .populate('author', 'name avatar') // Pull author info dynamically
    ]);

    // Gather distinct categories handled across your database posts
    const uniqueCategories = await Post.distinct('category');
    const totalCategories = uniqueCategories.length;

    res.status(200).json({
      success: true,
      stats: {
        posts: totalPosts,
        categories: totalCategories,
        users: totalUsers,
        comments: totalComments
      },
      recentPosts
    });
  } catch (error) {
    next(error);
  }
};