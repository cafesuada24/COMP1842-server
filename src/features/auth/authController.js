const User = require('./authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../config/authConfig');

async function register(req, res) {
    try {
        const { email, password, name } = req.body;

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ email, password, name });
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user.' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the entered password with the stored hash
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in user.' });
    }
}

module.exports = { register, login };
