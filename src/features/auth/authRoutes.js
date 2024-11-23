import { Router } from 'express';
import { register, login } from './authController.js';
import { verifyUser } from './authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyUser, (req, res) => {
    res.status(200).json({ user: req.user });
});

export default router;
