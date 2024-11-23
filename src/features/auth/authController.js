import User from '../auth/authModel.js'
import { generateToken } from '../../utils/jwtUtils.js';

async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    //const token = jwt.sign(
    //    { userId: user._id, role: user.role },
    //    JWT_SECRET,
    //    { expiresIn: JWT_EXPIRES_IN }
    //);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in user.' });
  }
}

export { register, login }
