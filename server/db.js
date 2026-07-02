import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
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

const ensureAdmin = db.prepare(`
  SELECT id FROM users WHERE username = ?
`);

const insertAdmin = db.prepare(`
  INSERT INTO users (username, password_hash, full_name, email, status, role)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const updateAdmin = db.prepare(`
  UPDATE users SET password_hash = ?, full_name = ?, email = ?, status = ?, role = ? WHERE username = ?
`);

const adminUser = ensureAdmin.get('admin');
const defaultAdminPassword = 'Malkin00.';
const passwordHash = bcrypt.hashSync(defaultAdminPassword, 10);
if (!adminUser) {
  insertAdmin.run('admin', passwordHash, 'Administrator', 'malkinlawrence00@gmail.com', 'Active', 'admin');
} else {
  updateAdmin.run(passwordHash, 'Administrator', 'malkinlawrence00@gmail.com', 'Active', 'admin', 'admin');
}

export default db;
