import { Router } from 'express';
import { createIncome, getIncomes, updateIncome, deleteIncome } from './income.controller.js';
import { verifyUser } from '../auth/auth.middleware.js';
import { validateUser } from '../user/user.middleware.js';

const router = Router();

router.get('/', verifyUser, getIncomes);
router.post('/', verifyUser, createIncome);
router.put('/:incomeId', verifyUser, updateIncome);
router.delete('/:incomeId', verifyUser, deleteIncome);

export default router;
