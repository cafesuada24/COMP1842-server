import { Router } from 'express';
import { createExpense, getExpenses, updateExpense, deleteExpense } from './expense.controller.js';
import { verifyUser } from '../auth/auth.middleware.js';
import { validateUser } from '../user/user.middleware.js';

const router = Router();

router.get('/', verifyUser, getExpenses);
router.post('/', verifyUser, validateUser, createExpense);
router.put('/:expenseId', verifyUser, validateUser, updateExpense);
router.delete('/:expenseId', verifyUser, validateUser, deleteExpense);

export default router;
