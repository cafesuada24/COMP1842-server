import { Router } from 'express';
import { register, login } from './authController';
import veriyUser from './authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', veriyUser, (req, res) => {
    res.status(200).json({ user: req.user });
});

export default router;
