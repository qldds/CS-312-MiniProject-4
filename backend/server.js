// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(cors({ origin: 'http://localhost:3000' })); // allow for react dev
app.use(express.json());

// In-memory "DB"
const users = []; // { id, user_id, name, password hash }
const posts = []; // { id, title, body, authorId, authorName, etc.}

// middleware, verify token, set req.user
function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // { id, user_id, name }
    next();
  });
}

/* Authorization routes */
// Sign up
app.post('/api/signup', async (req, res) => {
  const { user_id, password, name } = req.body;
  if (!user_id || !password || !name) return res.status(400).json({ error: 'Missing fields' });

  if (users.some(u => u.user_id === user_id)) return res.status(409).json({ error: 'User exists' });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const id = uuidv4();
  users.push({ id, user_id, name, passwordHash });

  const token = jwt.sign({ id, user_id, name }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ success: true, token, user: { id, user_id, name } });
});

// Sign in
app.post('/api/signin', async (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) return res.status(400).json({ error: 'Missing fields' });

  const user = users.find(u => u.user_id === user_id);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, user_id: user.user_id, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ success: true, token, user: { id: user.id, user_id: user.user_id, name: user.name } });
});

/* Posts all routes */
// Get all posts
app.get('/api/posts', (req, res) => {
  // newest posts first
  const copy = posts.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(copy);
});

// Creates post
app.post('/api/posts', authenticateToken, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Missing title/body' });
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const newPost = {
    id,
    title,
    body,
    authorId: req.user.id,
    authorName: req.user.name,
    createdAt,
    updatedAt: createdAt
  };
  posts.push(newPost);
  res.json({ success: true, post: newPost });
});

// Edits post
app.put('/api/posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.authorId !== req.user.id) return res.status(403).json({ error: 'Not authorized to edit' });

  if (title) post.title = title;
  if (body) post.body = body;
  post.updatedAt = new Date().toISOString();
  res.json({ success: true, post });
});

// Deletes post
app.delete('/api/posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const post = posts[idx];
  if (post.authorId !== req.user.id) return res.status(403).json({ error: 'Not authorized to delete' });
  posts.splice(idx, 1);
  res.json({ success: true });
});

// default
app.get('/', (req, res) => res.send({ ok: true }));
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
