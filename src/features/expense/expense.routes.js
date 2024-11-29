import { Router } from 'express';
import { createExpense, getExpenses, updateExpense, deleteExpense } from './expense.controller.js';
import { verifyUser } from '../auth/auth.middleware.js';

const router = Router();

router.get('/', verifyUser, getExpenses);
router.post('/', verifyUser, createExpense);
router.put('/:expenseId', verifyUser, updateExpense);
router.delete('/:expenseId', verifyUser, deleteExpense);

export default router;
