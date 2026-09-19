import { createClient } from '@supabase/supabase-js';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  '';

const useSupabase = Boolean(supabaseUrl && supabaseServiceRoleKey);
const supabase = useSupabase
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

const localDbPath =
  process.env.SQLITE_DB_PATH ||
  (process.env.VERCEL ? '/tmp/matches-tool.sqlite' : path.join(__dirname, 'database.sqlite'));

let localDb = null;

function getLocalDb() {
  if (!localDb) {
    localDb = new Database(localDbPath);
    localDb.pragma('journal_mode = WAL');
    localDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        email TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        subscription_expiry TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        role TEXT NOT NULL DEFAULT 'customer'
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return localDb;
}

export const storageMode = useSupabase ? 'supabase' : 'sqlite';

async function supabaseQuery(operation) {
  if (!supabase) throw new Error('Supabase storage is not configured.');
  const result = await operation();
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

export async function ensureAdmin() {
  const username = 'malkinlawrence00@gmail.com';
  const email = 'malkinlawrence00@gmail.com';
  const password = 'Malkin00.';
  const passwordHash = bcrypt.hashSync(password, 10);

  if (useSupabase) {
    const existing = await supabaseQuery(() =>
      supabase.from('users').select('id,username,email').or(`email.eq.${email},username.eq.${username}`).limit(1).maybeSingle()
    );

    if (!existing) {
      await supabaseQuery(() =>
        supabase.from('users').insert({
          username,
          password_hash: passwordHash,
          full_name: 'Administrator',
          email,
          status: 'Active',
          role: 'admin',
        }).select().single()
      );
    } else {
      await supabaseQuery(() =>
        supabase.from('users')
          .update({
            username,
            password_hash: passwordHash,
            full_name: 'Administrator',
            email,
            status: 'Active',
            role: 'admin',
          })
          .eq('id', existing.id)
      );
    }
    return;
  }

  const db = getLocalDb();
  const existing = db.prepare('SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1').get(email, username);
  if (!existing) {
    db.prepare(`
      INSERT INTO users (username, password_hash, full_name, email, status, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(username, passwordHash, 'Administrator', email, 'Active', 'admin');
  } else {
    db.prepare(`
      UPDATE users
      SET username = ?, password_hash = ?, full_name = ?, email = ?, status = ?, role = ?
      WHERE id = ?
    `).run(username, passwordHash, 'Administrator', email, 'Active', 'admin', existing.id);
  }
}

export async function getUserByUsername(username) {
  if (useSupabase) {
    return supabaseQuery(() =>
      supabase.from('users').select('*').eq('username', username).maybeSingle()
    );
  }
  return getLocalDb().prepare('SELECT * FROM users WHERE username = ?').get(username);
}

export async function getUserById(id) {
  if (useSupabase) {
    return supabaseQuery(() =>
      supabase.from('users').select('*').eq('id', id).maybeSingle()
    );
  }
  return getLocalDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export async function getAdminByEmail(email) {
  if (useSupabase) {
    return supabaseQuery(() =>
      supabase.from('users').select('*').eq('email', email).eq('role', 'admin').maybeSingle()
    );
  }
  return getLocalDb().prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, 'admin');
}

export async function listUsers() {
  if (useSupabase) {
    return supabaseQuery(() =>
      supabase.from('users')
        .select('id,username,full_name,email,status,subscription_expiry,created_at,role')
        .order('created_at', { ascending: false })
    );
  }
  return getLocalDb().prepare('SELECT id, username, full_name, email, status, subscription_expiry, created_at, role FROM users ORDER BY created_at DESC').all();
}

export async function createUser({ username, passwordHash, fullName, email, status = 'Active', subscriptionExpiry = null, role = 'customer' }) {
  if (useSupabase) {
    return supabaseQuery(() =>
      supabase.from('users').insert({
        username,
        password_hash: passwordHash,
        full_name: fullName || null,
        email: email || null,
        status,
        subscription_expiry: subscriptionExpiry || null,
        role,
      }).select().single()
    );
  }

  const db = getLocalDb();
  const result = db.prepare(`
    INSERT INTO users (username, password_hash, full_name, email, status, subscription_expiry, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(username, passwordHash, fullName || null, email || null, status, subscriptionExpiry || null, role);
  return getUserById(result.lastInsertRowid);
}

export async function updateUser(id, updates) {
  const allowed = ['username', 'fullName', 'email', 'status', 'subscriptionExpiry', 'role'];
  const normalized = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      normalized[
        key === 'fullName' ? 'full_name' :
        key === 'subscriptionExpiry' ? 'subscription_expiry' : key
      ] = updates[key];
    }
  }

  if (updates.passwordHash) normalized.password_hash = updates.passwordHash;

  if (useSupabase) {
    if (Object.keys(normalized).length > 0) {
      await supabaseQuery(() =>
        supabase.from('users').update(normalized).eq('id', id)
      );
    }
    return getUserById(id);
  }

  const fields = Object.keys(normalized);
  if (fields.length === 0) return getUserById(id);
  const values = fields.map((field) => normalized[field]);
  getLocalDb().prepare(`UPDATE users SET ${fields.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`).run(...values, id);
  return getUserById(id);
}

export async function deleteUser(id) {
  if (useSupabase) {
    await supabaseQuery(() => supabase.from('users').delete().eq('id', id));
    return;
  }
  getLocalDb().prepare('DELETE FROM users WHERE id = ?').run(id);
}
