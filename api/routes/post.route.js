import express from 'express';
import { createPost, deletePost, getAllPosts, getPostBySlug, getPosts, getRelatedPosts, likePost } from '../controllers/post.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyToken } from '../middleware/verifyToken.middleware.js';
import { verifyAdmin } from '../middleware/verifyAdmin.middleware.js';

const postRouter = express.Router();

// 'file' is the name of the field coming from the frontend
postRouter.post('/create', upload.single('file'), createPost);
postRouter.get('/getpost/:slug', getPostBySlug);
postRouter.get('/all-posts', getPosts);
postRouter.get('/related', getRelatedPosts);
postRouter.put('/likePost/:postId', verifyToken, (req, res, next) => {
  next();
}, likePost);

postRouter.get('/allposts', verifyAdmin, getAllPosts);
postRouter.delete('/deletepost/:id', verifyAdmin, deletePost);


export default postRouter;