# Real-Time Chat App (Socket.IO + React + Node.js)

Multi-room chat with live messages, online users, typing indicators and
automatic reconnect. No database needed: everything is kept in memory
(restarting the server clears rooms and history).

## Requirements
- Node.js 18+

## Run
From this folder (use `install-all`, not plain `npm install`):
```bash
npm run install-all
npm run dev
```
Open http://localhost:5173 in two browser windows (use different names) and chat.

## Production (single server)
```bash
npm run build
set NODE_ENV=production        (Windows CMD)  |  $env:NODE_ENV="production"  (PowerShell)
npm start                      # serves API, sockets and the built app on :5000
```

## Features
- Join with a unique username (2-20 characters)
- Rooms: General, Random, Tech by default, plus create your own (max 20)
- Live messages, last 100 messages kept per room
- Online users per room, join/leave notices
- "X is typing..." indicator
- Auto reconnect, re-joins your room
- Server-side validation: name rules, 1000-character messages, rate limit (10 messages / 5 s)

## Socket events
Client to server (all use acknowledgements `{ ok, error? }`):
| Event        | Payload              | Result                                   |
|--------------|----------------------|------------------------------------------|
| join         | { username, room }   | joins; returns history, users, rooms     |
| switchRoom   | { room }             | moves to another room; returns history   |
| createRoom   | { name }             | creates a room; returns its key          |
| message      | { text }             | broadcasts to the current room           |
| typing       | { isTyping }         | notifies others in the room              |

Server to client: `message`, `system`, `users`, `rooms`, `typing`.

## Configuration (`server/.env`)
`PORT` (default 5000), `CLIENT_ORIGIN` (default http://localhost:5173)
