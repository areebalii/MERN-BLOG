import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middleware/varifyAdmin.middleware.js';

const adminRouter = express.Router();

adminRouter.get('/stats', verifyAdmin, getDashboardStats);

export default adminRouter;