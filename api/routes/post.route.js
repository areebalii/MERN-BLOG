import express from 'express';
import { createPost } from '../controllers/post.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const postRouter = express.Router();

// 'file' is the name of the field coming from the frontend
postRouter.post('/create', upload.single('file'), createPost);

export default postRouter;