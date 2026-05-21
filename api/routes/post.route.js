import express from 'express';
import {
  createPost,
  deletePost,
  deletePostUser,
  getAllPosts,
  getPostBySlug,
  getPosts,
  getRelatedPosts,
  likePost,
  getPostById, 
  updatePost   
} from '../controllers/post.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyToken } from '../middleware/verifyToken.middleware.js';
import { verifyAdmin } from '../middleware/verifyAdmin.middleware.js';

const postRouter = express.Router();

/* ── PUBLIC ENDPOINTS ────────────────────────────────────── */
postRouter.get('/all-posts', getPosts);
postRouter.get('/getpost/:slug', getPostBySlug);
postRouter.get('/related', getRelatedPosts);
postRouter.get('/getpost-by-id/:postId', getPostById); 

/* ── AUTHENTICATED USER ENDPOINTS ───────────────────────── */
postRouter.post('/create', verifyToken, upload.single('file'), createPost);
postRouter.put('/likePost/:postId', verifyToken, likePost);

// Post Author / Admin edit update target endpoint hook
postRouter.put('/updatepost/:postId/:userId', verifyToken, upload.single('file'), updatePost); 

// Post Author / Admin manual delete target endpoint hook
postRouter.delete('/deletepost-user/:postId/:userId', verifyToken, deletePostUser);

/* ── ADMIN INTERACTION SYSTEM ENDPOINTS ─────────────────── */
postRouter.get('/allposts', verifyAdmin, getAllPosts);
postRouter.delete('/deletepost/:id', verifyAdmin, deletePost);

export default postRouter;