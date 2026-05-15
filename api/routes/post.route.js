import express from 'express';
import { createPost, getPostBySlug, getPosts, getRelatedPosts, likePost } from '../controllers/post.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyToken } from '../middleware/verifyToken.middleware.js';

const postRouter = express.Router();

// 'file' is the name of the field coming from the frontend
postRouter.post('/create', upload.single('file'), createPost);
postRouter.get('/getpost/:slug', getPostBySlug);
postRouter.get('/all-posts', getPosts);
postRouter.get('/related', getRelatedPosts);
postRouter.put('/likePost/:postId', verifyToken, (req, res, next) => {
  console.log("REQ USER:", req.user);       // see what's in token
  console.log("POST ID:", req.params.postId);
  next();
}, likePost); export default postRouter;