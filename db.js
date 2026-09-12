const Database = require('better-sqlite3');
const db = new Database('./library.db');

// 建表（如果不存在）
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    borrowed INTEGER DEFAULT 0
  )
`);

// 如果表是空的，插几本初始书
const count = db.prepare('SELECT COUNT(*) AS n FROM books').get().n;
if (count === 0) {
  const insert = db.prepare('INSERT INTO books (title, author, borrowed) VALUES (?, ?, ?)');
  insert.run('三体', '刘慈欣', 0);
  insert.run('活着', '余华', 1);
  insert.run('小王子', '圣埃克苏佩里', 0);
}

module.exports = db;