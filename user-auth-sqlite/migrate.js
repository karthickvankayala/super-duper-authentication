const db = require('./db');

try {
  db.prepare(`ALTER TABLE users ADD COLUMN "dob" TEXT NOT NULL DEFAULT '01/01/1970'`).run();
  db.prepare(`ALTER TABLE users ADD COLUMN job_title TEXT`).run();
  console.log('Migration successful!');
} catch (err) {
  console.error('Migration failed:', err.message);
}