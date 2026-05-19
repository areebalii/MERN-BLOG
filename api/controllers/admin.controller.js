import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';

export const getDashboardStats = async (req, res, next) => {
  console.log("getDashboardStats called"); // ← add this
  try {
    console.log("Starting DB queries..."); // ← and this
    const [totalPosts, totalUsers, totalComments, recentPosts] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
      Post.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('author', 'name avatar')
    ]);
    console.log("DB queries done", { totalPosts, totalUsers, totalComments }); // ← and this

    const uniqueCategories = await Post.distinct('category');

    res.status(200).json({
      success: true,
      stats: {
        posts: totalPosts,
        categories: uniqueCategories.length,
        users: totalUsers,
        comments: totalComments
      },
      recentPosts
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message, error.stack);
    next(error);
  }
};