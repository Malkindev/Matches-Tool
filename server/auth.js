import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';

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
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

export const getUserByUsername = (username) => db.prepare('SELECT * FROM users WHERE username = ?').get(username);

export const getUserById = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id);

export const createUser = async ({ username, password, fullName, email, status = 'Active', subscriptionExpiry = null, role = 'customer' }) => {
  const passwordHash = await hashPassword(password);
  const insert = db.prepare(`
    INSERT INTO users (username, password_hash, full_name, email, status, subscription_expiry, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insert.run(username, passwordHash, fullName || null, email || null, status, subscriptionExpiry || null, role);
  return getUserById(result.lastInsertRowid);
};

export const updateUser = async (id, updates) => {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return getUserById(id);
  }

  values.push(id);
  db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getUserById(id);
};

export const deleteUser = (id) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
};

export const listUsers = () => db.prepare('SELECT id, username, full_name, email, status, subscription_expiry, created_at, role FROM users ORDER BY created_at DESC').all();
