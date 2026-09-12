const Database = require('better-sqlite3');
const db = new Database('./library.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isbn TEXT,
    title TEXT NOT NULL,
    author TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS copies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    status TEXT DEFAULT 'available',
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
  );
`);

// 如果空表，插初始数据
const count = db.prepare('SELECT COUNT(*) AS n FROM books').get().n;
if (count === 0) {
  const insertBook = db.prepare('INSERT INTO books (isbn, title, author) VALUES (?, ?, ?)');
  const insertCopy = db.prepare('INSERT INTO copies (book_id, status) VALUES (?, ?)');

  const b1 = insertBook.run('9787536692930', '三体', '刘慈欣').lastInsertRowid;
  insertCopy.run(b1, 'available');
  insertCopy.run(b1, 'available');
  insertCopy.run(b1, 'borrowed');

  const b2 = insertBook.run('9787506365437', '活着', '余华').lastInsertRowid;
  insertCopy.run(b2, 'available');
}

module.exports = db;