import { Router } from 'express';
import { getDashboard } from './dashboard.controller.js';
import { verifyUser } from '../auth/auth.middleware.js';
import { validateUser } from '../user/user.middleware.js';

const router = Router();

router.get('/', verifyUser, validateUser, getDashboard);

export default router;
