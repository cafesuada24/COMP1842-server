import { verifyToken } from '../../utils/jwtUtils';

function verifyUser(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    //const decoded = jwt.verify(token, JWT_SECRET);
    const decoded = verifyToken(token)
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = { verifyUser };
