import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  ensureAdmin,
  getUserByUsername,
  getUserById,
  getAdminByEmail,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from './store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const hashPassword = async (password) => bcrypt.hash(password, 10);
export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);
export const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    req.user = verifyToken(authHeader.split(' ')[1]);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

export {
  ensureAdmin,
  getUserByUsername,
  getUserById,
  getAdminByEmail,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};
