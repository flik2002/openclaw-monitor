
const Database = require('better-sqlite3');
const db = new Database('/var/www/biglegs-backend/backend/data.db');
const users = db.prepare('SELECT id, email, created_at FROM users').all();
console.log(JSON.stringify(users, null, 2));
db.close();
