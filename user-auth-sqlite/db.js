const Database = require('better-sqlite3');
const db = new Database('users.db');

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    dob TEXT NOT NULL,
    job_title TEXT,
    is_active INTEGER DEFAULT 1
  )
`).run();

module.exports = db;
