const express = require('express');
const { register, login } = require('./authController');
const veriyUser = require('./authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', veriyUser, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;
