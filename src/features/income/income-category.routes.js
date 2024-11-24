
import { Router } from 'express';
const router = Router();
import { getCategories, createCategory, updateCategory, deleteCategory } from './income-category.controller.js';

import { verifyUser } from '../auth/auth.middleware.js';

router.get('/', verifyUser, getCategories); 
router.post('/', verifyUser, createCategory);
router.put('/:id', verifyUser, updateCategory);
router.delete('/:id', verifyUser, deleteCategory);

export default router;
