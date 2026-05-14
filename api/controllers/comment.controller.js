import { handleError } from '../helpers/handleError.js';
import Comment from '../models/comment.model.js';

// CREATE COMMENT
// api/controllers/comment.controller.js
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    // Check if req.user exists (provided by verifyToken)
    if (!req.user) {
      return next(handleError(401, 'You must be logged in'));
    }

    // Ensure the ID matches (check if your JWT uses .id or ._id)
    const currentUserId = req.user.id || req.user._id;

    if (userId !== currentUserId) {
      return next(handleError(403, 'You are not allowed to create this comment'));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    console.error("Comment Error:", error); // This helps you see the error in the console
    next(error);
  }
};

// GET ALL COMMENTS FOR A POST
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// LIKE/UNLIKE A COMMENT
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(handleError(404, 'Comment not found'));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// EDIT COMMENT
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    // Check if user is the owner OR an admin
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return next(handleError(403, 'You are not allowed to edit this comment'));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(handleError(404, 'Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(handleError(403, 'You are not allowed to delete this comment'));
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};