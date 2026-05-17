import Category from '../models/category.model.js';
import { handleError } from '../helpers/handleError.js';

// Create Category
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return next(handleError(400, 'Category name is required'));

    const slug = name.toLowerCase().split(' ').join('-');

    const existing = await Category.findOne({ slug });
    if (existing) return next(handleError(400, 'Category already exists'));

    const newCategory = new Category({ name, slug });
    await newCategory.save();

    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    next(error);
  }
};

// Get All Categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// Delete Category
export const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};