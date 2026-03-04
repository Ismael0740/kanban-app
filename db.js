import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'data.json');

const defaultData = { users: [], boards: [] };

function load() {
  if (!existsSync(DB_PATH)) {
    return { ...defaultData };
  }
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { ...defaultData };
  }
}

function save(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function getUsers() {
  return load().users;
}

export function addUser(user) {
  const data = load();
  data.users.push(user);
  save(data);
}

export function findUserByEmail(email) {
  return load().users.find((u) => u.email === email.toLowerCase().trim());
}

export function findUserById(id) {
  return load().users.find((u) => u.id === id);
}

export function getBoards(userId) {
  return load().boards.filter((b) => b.userId === userId);
}

export function getBoard(id, userId) {
  return load().boards.find((b) => b.id === id && b.userId === userId);
}

export function addBoard(board) {
  const data = load();
  data.boards.push(board);
  save(data);
}

export function updateBoard(id, userId, updates) {
  const data = load();
  const idx = data.boards.findIndex((b) => b.id === id && b.userId === userId);
  if (idx < 0) return false;
  data.boards[idx] = { ...data.boards[idx], ...updates };
  save(data);
  return true;
}

export function deleteBoard(id, userId) {
  const data = load();
  const before = data.boards.length;
  data.boards = data.boards.filter((b) => !(b.id === id && b.userId === userId));
  if (data.boards.length === before) return false;
  save(data);
  return true;
}
