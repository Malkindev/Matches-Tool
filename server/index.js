import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { storageMode } from './store.js';
import {
  authenticate,
  comparePassword,
  createUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  listUsers,
  requireAdmin,
  signToken,
  updateUser,
} from './auth.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.options('/{*splat}', cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.use((req, res, next) => {
    console.info(`[server] ${req.method} ${req.originalUrl}`);
    next();
  });

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, environment: process.env.VERCEL ? 'vercel' : 'local' });
  });

  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await getAdminByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const passwordMatches = await comparePassword(password, user.password_hash);
      if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = signToken({ id: user.id, username: user.username, role: user.role });
      return res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email, fullName: user.full_name } });
    } catch (error) {
      console.error('[server] admin login failed', error);
      return res.status(500).json({ message: 'Admin login failed.', error: error.message });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      const user = await getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const passwordMatches = await comparePassword(password, user.password_hash);
      if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      if (user.status !== 'Active') {
        return res.status(403).json({ message: 'Your account is inactive. Contact support.' });
      }

      const expiry = user.subscription_expiry ? new Date(user.subscription_expiry) : null;
      const now = new Date();
      if (expiry && expiry < now) {
        return res.status(403).json({ message: 'Your subscription has expired. Please contact the administrator to renew.' });
      }

      const token = signToken({ id: user.id, username: user.username, role: user.role });
      return res.json({ token, user: { id: user.id, username: user.username, role: user.role, fullName: user.full_name, email: user.email, status: user.status, subscriptionExpiry: user.subscription_expiry } });
    } catch (error) {
      console.error('[server] login failed', error);
      return res.status(500).json({ message: 'Login failed.', error: error.message });
    }
  });

  app.get('/api/me', authenticate, (req, res) => {
    try {
      const user = await getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.json({ user: { id: user.id, username: user.username, role: user.role, fullName: user.full_name, email: user.email, status: user.status, subscriptionExpiry: user.subscription_expiry } });
    } catch (error) {
      console.error('[server] /api/me failed', error);
      return res.status(500).json({ message: 'Failed to load user.', error: error.message });
    }
  });

  app.get('/api/admin/users', authenticate, requireAdmin, (req, res) => {
    return listUsers().then((users) => res.json({ users })).catch((error) => res.status(500).json({ message: 'Failed to load users.', error: error.message }));
  });

  app.post('/api/admin/users', authenticate, requireAdmin, async (req, res) => {
    try {
      const { username, password, fullName, email, status, subscriptionExpiry, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      const existing = await getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: 'Username already exists.' });
      }

      const passwordHash = await hashPassword(password);\n      const user = await createUser({ username, passwordHash, fullName, email, status, subscriptionExpiry, role });
      return res.status(201).json({ user });
    } catch (error) {
      console.error('[server] create user failed', error);
      return res.status(500).json({ message: 'Failed to create user.', error: error.message });
    }
  });

  app.put('/api/admin/users/:id', authenticate, requireAdmin, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { password, ...updates } = req.body;

      let updatedUser = await updateUser(userId, updates);
      if (password) {
        const passwordHash = await import('bcryptjs').then(({ default: bcrypt }) => bcrypt.hash(password, 10));
        updatedUser = await updateUser(userId, { password_hash: passwordHash });
      }

      return res.json({ user: updatedUser });
    } catch (error) {
      console.error('[server] update user failed', error);
      return res.status(500).json({ message: 'Failed to update user.', error: error.message });
    }
  });

  app.delete('/api/admin/users/:id', authenticate, requireAdmin, (req, res) => {
    try {
      await deleteUser(Number(req.params.id));
      return res.json({ success: true });
    } catch (error) {
      console.error('[server] delete user failed', error);
      return res.status(500).json({ message: 'Failed to delete user.', error: error.message });
    }
  });

  app.post('/api/admin/users/:id/reset-password', authenticate, requireAdmin, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: 'A new password is required.' });
      }
      const passwordHash = await import('bcryptjs').then(({ default: bcrypt }) => bcrypt.hash(password, 10));
      const user = await updateUser(userId, { password_hash: passwordHash });
      return res.json({ success: true, user });
    } catch (error) {
      console.error('[server] reset password failed', error);
      return res.status(500).json({ message: 'Failed to reset user password.', error: error.message });
    }
  });

  app.use((err, req, res, next) => {
    console.error('[server] uncaught error', err);
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  });

  return app;
}

const app = createApp();\n\n// Initialize the persistent store before serving requests. Supabase is used on Vercel when configured.\nconst storeReady = ensureAdmin().catch((error) => {\n  console.error('[server] storage initialization failed', { mode: storageMode, error: error.message });\n  return error;\n});
const PORT = process.env.PORT || 3001;
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
  });
}

export default function handler(req, res) {
  return app(req, res);
}
