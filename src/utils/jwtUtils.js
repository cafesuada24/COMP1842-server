//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import { JWT_SECRET, } from '../config/authConfig.js';

export function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
