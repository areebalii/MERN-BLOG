import express from 'express';
import { createCategory, getCategories, deleteCategory } from '../controllers/category.controller.js';
import { verifyAdmin } from '../middleware/verifyAdmin.middleware.js';

const categoryRouter = express.Router();

categoryRouter.post('/create', verifyAdmin, createCategory);
categoryRouter.get('/all', getCategories);
categoryRouter.delete('/delete/:id', verifyAdmin, deleteCategory);

export default categoryRouter;