import { Router } from 'express';
const router = Router();
import { getProfile } from './user.controller.js';
import { verifyUser } from '../auth/auth.middleware.js';

router.get('/profile', verifyUser, getProfile);

export default router;
