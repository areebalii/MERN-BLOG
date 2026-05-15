import { handleError } from '../helpers/handleError.js';
import Comment from '../models/comment.model.js';

// CREATE COMMENT
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    const currentUserId = (req.user._id || req.user.id).toString(); // 👈 toString()

    if (!currentUserId) {
      return next(handleError(401, 'User ID not found in token'));
    }

    if (userId !== currentUserId) {
      return next(handleError(403, 'You are not allowed to create this comment'));
    }

    const newComment = new Comment({
      content,
      postId,
      userId: currentUserId,
    });

    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    console.log("BACKEND ERROR:", error);
    next(error);
  }
};

// GET ALL COMMENTS FOR A POST
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

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
    if (!comment) {
      return next(handleError(404, 'Comment not found'));
    }

    // Use .toString() to compare IDs correctly
    const isOwner = comment.userId.toString() === (req.user.id || req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return next(handleError(403, 'You are not allowed to edit this comment'));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );

    // Optional: Populate user info again so the frontend keeps the avatar/name
    const populatedComment = await editedComment.populate('userId', 'name avatar');

    res.status(200).json(populatedComment);
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

    // Convert both to String to ensure they match correctly
    const isOwner = comment.userId.toString() === (req.user.id || req.user._id);
    const isAdmin = req.user.role === 'admin' || req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return next(handleError(403, 'You are not allowed to delete this comment'));
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};