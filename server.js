const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
});

const FILE = './books.json';

// 读数据
function load() {
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

// 写数据（这一步还没用上，但先放着）
function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ===== 查：列出所有书 =====
app.get('/api/books', (req, res) => {
  const db = load();
  res.json({ ok: true, books: db.books });
});


app.post('/api/books', (req, res) => {
  const db = load();
  const { title, author } = req.body;

  const newBook = {
    id: db.books.length ? Math.max(...db.books.map(b => b.id)) + 1 : 1,
    title,
    author,
    borrowed: false,
  };

  db.books.push(newBook);
  save(db);

  res.json({ ok: true, book: newBook });
});

app.delete('/api/books/:id', (req, res) => {
  const db = load();
  const id = Number(req.params.id);

  const before = db.books.length;
  db.books = db.books.filter(b => b.id !== id);

  if (db.books.length === before) {
    return res.json({ ok: false, msg: '没找到这本书' });
  }

  save(db);
  res.json({ ok: true });
});

app.put('/api/books/:id', (req, res) => {
  const db = load();
  const id = Number(req.params.id);
  const book = db.books.find(b => b.id === id);

  if (!book) {
    return res.json({ ok: false, msg: '没找到这本书' });
  }

  const { title, author, borrowed } = req.body;
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (borrowed !== undefined) book.borrowed = borrowed;

  save(db);
  res.json({ ok: true, book });
});


app.listen(3000, () => {
  console.log('图书馆后端跑起来了：http://localhost:3000');
});