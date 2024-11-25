import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from './expense-category.controller.js';
import { verifyUser } from '../auth/auth.middleware.js';

const router = Router();
router.get('/', verifyUser, getCategories); 
router.post('/', verifyUser, createCategory);
router.put('/:id', verifyUser, updateCategory);
router.delete('/:id', verifyUser, deleteCategory);

export default router;
