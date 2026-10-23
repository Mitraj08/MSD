require('dotenv').config();
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const ORIGINS = [CLIENT_ORIGIN, 'http://127.0.0.1:5173'];

const MAX_HISTORY = 100;
const MAX_MESSAGE = 1000;
const MAX_ROOMS = 20;
const RATE_LIMIT = { count: 10, windowMs: 5000 };

const app = express();
app.use(cors({ origin: ORIGINS }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve the built React app in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: ORIGINS } });

// ---------- in-memory state ----------
const rooms = new Map(); // key -> { name, history: [] }
const users = new Map(); // socket.id -> { username, room, stamps: [] }

const keyOf = (name) => String(name).trim().toLowerCase().replace(/\s+/g, ' ');
const chan = (key) => `room:${key}`;
const now = () => new Date().toISOString();

['General', 'Random', 'Tech'].forEach((name) => rooms.set(keyOf(name), { name, history: [] }));

const roomUsers = (key) =>
  [...users.values()]
    .filter((u) => u.room === key)
    .map((u) => u.username)
    .sort((a, b) => a.localeCompare(b));

const roomList = () => {
  const counts = {};
  users.forEach((u) => {
    counts[u.room] = (counts[u.room] || 0) + 1;
  });
  return [...rooms.entries()].map(([key, r]) => ({ key, name: r.name, count: counts[key] || 0 }));
};

const broadcastState = (key) => {
  io.to(chan(key)).emit('users', { room: key, users: roomUsers(key) });
  io.emit('rooms', roomList());
};

const system = (key, text) => io.to(chan(key)).emit('system', { room: key, text, time: now() });

const roomState = (key) => ({
  room: { key, name: rooms.get(key).name },
  history: rooms.get(key).history,
  users: roomUsers(key),
  rooms: roomList(),
});

// ---------- validation ----------
const validateUsername = (name) => {
  if (name.length < 2 || name.length > 20) return 'Name must be 2 to 20 characters.';
  if (!/^[\p{L}\p{N}_\- ]+$/u.test(name)) {
    return 'Use only letters, numbers, spaces, hyphens and underscores.';
  }
  return null;
};

const nameTaken = (name, exceptId) =>
  [...users.entries()].some(
    ([id, u]) => id !== exceptId && u.username.toLowerCase() === name.toLowerCase()
  );

// ---------- membership helpers ----------
const attach = (socket, username, key) => {
  users.set(socket.id, { username, room: key, stamps: [] });
  socket.join(chan(key));
  socket.to(chan(key)).emit('system', { room: key, text: `${username} joined`, time: now() });
  broadcastState(key);
};

const detach = (socket, user) => {
  socket.leave(chan(user.room));
  users.delete(socket.id);
  io.to(chan(user.room)).emit('typing', { room: user.room, user: user.username, isTyping: false });
  system(user.room, `${user.username} left`);
  broadcastState(user.room);
};

// ---------- socket handlers ----------
io.on('connection', (socket) => {
  const reply = (cb) => (typeof cb === 'function' ? cb : () => {});

  socket.on('join', (payload, cb) => {
    const ack = reply(cb);
    const username = String(payload?.username ?? '').trim().replace(/\s+/g, ' ');
    const error = validateUsername(username);
    if (error) return ack({ ok: false, error });
    if (nameTaken(username, socket.id)) {
      return ack({ ok: false, error: 'That name is already in use. Pick another.' });
    }
    const wanted = keyOf(payload?.room ?? '');
    const key = rooms.has(wanted) ? wanted : 'general';

    const existing = users.get(socket.id);
    if (existing) detach(socket, existing);
    attach(socket, username, key);
    ack({ ok: true, username, ...roomState(key) });
  });

  socket.on('switchRoom', (payload, cb) => {
    const ack = reply(cb);
    const user = users.get(socket.id);
    if (!user) return ack({ ok: false, error: 'Join the chat first.' });
    const key = keyOf(payload?.room ?? '');
    if (!rooms.has(key)) return ack({ ok: false, error: 'That room does not exist.' });
    if (key === user.room) return ack({ ok: true, ...roomState(key) });

    const old = user.room;
    socket.leave(chan(old));
    io.to(chan(old)).emit('typing', { room: old, user: user.username, isTyping: false });
    system(old, `${user.username} left`);
    user.room = key;
    broadcastState(old);

    socket.join(chan(key));
    socket.to(chan(key)).emit('system', { room: key, text: `${user.username} joined`, time: now() });
    broadcastState(key);
    ack({ ok: true, ...roomState(key) });
  });

  socket.on('createRoom', (payload, cb) => {
    const ack = reply(cb);
    if (!users.has(socket.id)) return ack({ ok: false, error: 'Join the chat first.' });
    const name = String(payload?.name ?? '').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 24) {
      return ack({ ok: false, error: 'Room name must be 2 to 24 characters.' });
    }
    if (!/^[\p{L}\p{N}_\- ]+$/u.test(name)) {
      return ack({ ok: false, error: 'Use only letters, numbers, spaces, hyphens and underscores.' });
    }
    const key = keyOf(name);
    if (rooms.has(key)) return ack({ ok: false, error: 'A room with that name already exists.' });
    if (rooms.size >= MAX_ROOMS) return ack({ ok: false, error: 'The room limit has been reached.' });

    rooms.set(key, { name, history: [] });
    io.emit('rooms', roomList());
    ack({ ok: true, room: { key, name } });
  });

  socket.on('message', (payload, cb) => {
    const ack = reply(cb);
    const user = users.get(socket.id);
    if (!user) return ack({ ok: false, error: 'Join the chat first.' });

    const text = String(payload?.text ?? '').trim();
    if (!text) return ack({ ok: false, error: 'Message is empty.' });
    if (text.length > MAX_MESSAGE) {
      return ack({ ok: false, error: `Message is too long (limit ${MAX_MESSAGE} characters).` });
    }

    const cutoff = Date.now() - RATE_LIMIT.windowMs;
    user.stamps = user.stamps.filter((t) => t > cutoff);
    if (user.stamps.length >= RATE_LIMIT.count) {
      return ack({ ok: false, error: 'You are sending messages too fast. Wait a moment.' });
    }
    user.stamps.push(Date.now());

    const message = {
      id: crypto.randomUUID(),
      room: user.room,
      user: user.username,
      text,
      time: now(),
    };
    const history = rooms.get(user.room).history;
    history.push(message);
    if (history.length > MAX_HISTORY) history.shift();

    io.to(chan(user.room)).emit('message', message);
    ack({ ok: true });
  });

  socket.on('typing', (payload) => {
    const user = users.get(socket.id);
    if (!user) return;
    socket.to(chan(user.room)).emit('typing', {
      room: user.room,
      user: user.username,
      isTyping: Boolean(payload?.isTyping),
    });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) detach(socket, user);
  });
});

server.listen(PORT, () => console.log(`Chat server running on http://localhost:${PORT}`));
