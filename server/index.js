import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import * as db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'kanban-dev-secret-change-in-production';

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Email y contraseña requeridos (mín. 6 caracteres)' });
  }
  const id = randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);
  const createdAt = new Date().toISOString();
  const normalizedEmail = email.toLowerCase().trim();
  if (db.findUserByEmail(normalizedEmail)) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }
  db.addUser({ id, email: normalizedEmail, passwordHash, createdAt });
  const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id, email: normalizedEmail } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }
  const user = db.findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.get('/api/boards', authMiddleware, (req, res) => {
  const boards = db.getBoards(req.userId).map((b) => ({
    id: b.id,
    name: b.name,
    columns: b.columns,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt
  }));
  res.json({ boards });
});

app.get('/api/boards/:id', authMiddleware, (req, res) => {
  const board = db.getBoard(req.params.id, req.userId);
  if (!board) {
    return res.status(404).json({ error: 'Tablero no encontrado' });
  }
  res.json({
    id: board.id,
    name: board.name,
    columns: board.columns,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt
  });
});

app.post('/api/boards', authMiddleware, (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nombre requerido' });
  }
  const id = randomUUID();
  const now = new Date().toISOString();
  const defaultColumns = [
    { id: 'backlog', title: 'Backlog', tasks: [] },
    { id: 'en-proceso', title: 'En proceso', tasks: [] },
    { id: 'bloqueado', title: 'Bloqueado', tasks: [] },
    { id: 'hecho', title: 'Hecho', tasks: [] }
  ];
  const board = { id, userId: req.userId, name: name.trim(), columns: defaultColumns, createdAt: now, updatedAt: now };
  db.addBoard(board);
  res.status(201).json({ id, name: board.name, columns: defaultColumns, createdAt: now, updatedAt: now });
});

app.put('/api/boards/:id', authMiddleware, (req, res) => {
  const board = db.getBoard(req.params.id, req.userId);
  if (!board) {
    return res.status(404).json({ error: 'Tablero no encontrado' });
  }
  const now = new Date().toISOString();
  const { name, columns } = req.body;
  const updated = {
    name: name ?? board.name,
    columns: columns ?? board.columns,
    updatedAt: now
  };
  db.updateBoard(req.params.id, req.userId, updated);
  res.json({ id: board.id, ...updated, createdAt: board.createdAt });
});

app.delete('/api/boards/:id', authMiddleware, (req, res) => {
  if (!db.deleteBoard(req.params.id, req.userId)) {
    return res.status(404).json({ error: 'Tablero no encontrado' });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API Kanban escuchando en http://localhost:${PORT}`);
});
