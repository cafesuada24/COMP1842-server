import { Router } from 'express';
import { createSavingGoal, getSavingGoals, updateSavingGoal, deleteSavingGoal } from '../saving-goal/saving-goal.controller.js';
import { verifyUser } from '../auth/auth.middleware.js';
import { validateUser } from '../user/user.middleware.js';

const router = Router();

router.post('/', verifyUser, validateUser, createSavingGoal);
router.get('/', verifyUser, validateUser, getSavingGoals);
router.put('/:goalId', verifyUser, validateUser, updateSavingGoal);
router.delete('/:goalId', verifyUser, validateUser, deleteSavingGoal);

export default router;
