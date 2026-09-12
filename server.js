const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

// ===== 查 =====
app.get('/api/books', (req, res) => {
  const books = db.prepare('SELECT * FROM books').all();
  res.json({ ok: true, books });
});

// ===== 增 =====
app.post('/api/books', (req, res) => {
  const { title, author } = req.body;
  const info = db.prepare('INSERT INTO books (title, author) VALUES (?, ?)').run(title, author);
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(info.lastInsertRowid);
  res.json({ ok: true, book });
});

// ===== 删 =====
app.delete('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM books WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.json({ ok: false, msg: '没找到这本书' });
  }
  res.json({ ok: true });
});

// ===== 改 =====
app.put('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
  if (!book) {
    return res.json({ ok: false, msg: '没找到这本书' });
  }

  const { title, author, borrowed } = req.body;
  db.prepare(`
    UPDATE books SET
      title = COALESCE(?, title),
      author = COALESCE(?, author),
      borrowed = COALESCE(?, borrowed)
    WHERE id = ?
  `).run(title ?? null, author ?? null, borrowed ?? null, id);

  const updated = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
  res.json({ ok: true, book: updated });
});

app.listen(3000, () => {
  console.log('图书馆后端跑起来了：http://localhost:3000');
});