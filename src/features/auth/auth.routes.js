import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { verifyUser } from './auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyUser, (req, res) => {
    res.status(200).json({ user: req.user });
});

export default router;
