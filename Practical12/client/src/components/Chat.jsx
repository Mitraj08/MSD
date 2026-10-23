import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket.js';

let localId = 0;
const nextId = () => `local-${Date.now()}-${localId++}`;
const clock = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Chat({ initial, onLeave }) {
  const username = initial.username;
  const [room, setRoom] = useState(initial.room);
  const [rooms, setRooms] = useState(initial.rooms);
  const [users, setUsers] = useState(initial.users);
  const [messages, setMessages] = useState(initial.history);
  const [typing, setTyping] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [roomError, setRoomError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roomRef = useRef(room);
  roomRef.current = room;
  const leaveRef = useRef(onLeave);
  leaveRef.current = onLeave;
  const listRef = useRef(null);
  const wasDisconnected = useRef(false);
  const typingTimers = useRef({});
  const iAmTyping = useRef(false);
  const stopTimer = useRef(null);

  // ----- socket listeners -----
  useEffect(() => {
    const applyState = (res) => {
      setRoom(res.room);
      roomRef.current = res.room;
      setMessages(res.history);
      setUsers(res.users);
      setRooms(res.rooms);
      setTyping([]);
    };

    const onMessage = (m) => {
      if (m.room !== roomRef.current.key) return;
      setMessages((prev) => [...prev, m].slice(-200));
      setTyping((prev) => prev.filter((u) => u !== m.user));
    };
    const onSystem = (m) => {
      if (m.room !== roomRef.current.key) return;
      setMessages((prev) => [...prev, { id: nextId(), type: 'system', text: m.text, time: m.time }]);
    };
    const onUsers = (p) => {
      if (p.room === roomRef.current.key) setUsers(p.users);
    };
    const onTyping = ({ room: r, user, isTyping }) => {
      if (r !== roomRef.current.key || user === username) return;
      clearTimeout(typingTimers.current[user]);
      if (isTyping) {
        setTyping((prev) => (prev.includes(user) ? prev : [...prev, user]));
        typingTimers.current[user] = setTimeout(
          () => setTyping((prev) => prev.filter((u) => u !== user)),
          4000
        );
      } else {
        setTyping((prev) => prev.filter((u) => u !== user));
      }
    };
    const onConnect = () => {
      setConnected(true);
      if (!wasDisconnected.current) return;
      wasDisconnected.current = false;
      socket.emit('join', { username, room: roomRef.current.key }, (res) => {
        if (res.ok) applyState(res);
        else leaveRef.current(res.error);
      });
    };
    const onDisconnect = () => {
      setConnected(false);
      wasDisconnected.current = true;
    };

    socket.on('message', onMessage);
    socket.on('system', onSystem);
    socket.on('users', onUsers);
    socket.on('rooms', setRooms);
    socket.on('typing', onTyping);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    const timers = typingTimers.current;
    return () => {
      socket.off('message', onMessage);
      socket.off('system', onSystem);
      socket.off('users', onUsers);
      socket.off('rooms', setRooms);
      socket.off('typing', onTyping);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      Object.values(timers).forEach(clearTimeout);
      clearTimeout(stopTimer.current);
    };
  }, [username]);

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  // ----- actions -----
  const stopTyping = () => {
    clearTimeout(stopTimer.current);
    if (iAmTyping.current) {
      iAmTyping.current = false;
      socket.emit('typing', { isTyping: false });
    }
  };

  const onInput = (e) => {
    setText(e.target.value);
    setSendError('');
    if (!iAmTyping.current) {
      iAmTyping.current = true;
      socket.emit('typing', { isTyping: true });
    }
    clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(stopTyping, 1500);
  };

  const send = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || !connected) return;
    socket.emit('message', { text: value }, (res) => {
      if (!res.ok) setSendError(res.error);
    });
    setText('');
    stopTyping();
  };

  const switchRoom = (key) => {
    setSidebarOpen(false);
    if (key === room.key) return;
    stopTyping();
    socket.emit('switchRoom', { room: key }, (res) => {
      if (!res.ok) {
        setSendError(res.error);
        return;
      }
      setRoom(res.room);
      roomRef.current = res.room;
      setMessages(res.history);
      setUsers(res.users);
      setRooms(res.rooms);
      setTyping([]);
      setSendError('');
    });
  };

  const createRoom = (e) => {
    e.preventDefault();
    if (!newRoom.trim()) return;
    socket.emit('createRoom', { name: newRoom }, (res) => {
      if (!res.ok) {
        setRoomError(res.error);
        return;
      }
      setNewRoom('');
      setRoomError('');
      switchRoom(res.room.key);
    });
  };

  const typingText =
    typing.length === 0
      ? ''
      : typing.length === 1
      ? `${typing[0]} is typing...`
      : typing.length === 2
      ? `${typing[0]} and ${typing[1]} are typing...`
      : 'Several people are typing...';

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="me">
          Signed in as <strong>{username}</strong>
        </div>

        <h2>Rooms</h2>
        <ul className="rooms">
          {rooms.map((r) => (
            <li key={r.key}>
              <button
                type="button"
                className={r.key === room.key ? 'active' : ''}
                onClick={() => switchRoom(r.key)}
              >
                <span># {r.name}</span>
                <span className="count">{r.count}</span>
              </button>
            </li>
          ))}
        </ul>

        <form className="new-room" onSubmit={createRoom}>
          <input
            value={newRoom}
            onChange={(e) => {
              setNewRoom(e.target.value);
              setRoomError('');
            }}
            placeholder="New room name"
            maxLength={24}
            aria-label="New room name"
          />
          <button type="submit" disabled={!newRoom.trim()}>
            Add
          </button>
        </form>
        {roomError && <p className="side-error">{roomError}</p>}

        <h2>In this room ({users.length})</h2>
        <ul className="people">
          {users.map((u) => (
            <li key={u}>
              <span className="dot" />
              {u}
              {u === username && <span className="you"> (you)</span>}
            </li>
          ))}
        </ul>
      </aside>

      <section className="main">
        <header className="topbar">
          <button type="button" className="menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle rooms and people">
            Rooms
          </button>
          <div className="title">
            <h1># {room.name}</h1>
            <span className="sub">{users.length} online</span>
          </div>
          <span className={`status ${connected ? 'on' : 'off'}`}>
            {connected ? 'Connected' : 'Reconnecting...'}
          </span>
          <button type="button" className="leave" onClick={() => onLeave()}>
            Leave
          </button>
        </header>

        <div className="messages" ref={listRef} aria-live="polite">
          {messages.length === 0 && <p className="empty">No messages yet. Say hello.</p>}
          {messages.map((m, i) => {
            if (m.type === 'system') {
              return (
                <p key={m.id} className="system">
                  {m.text}
                </p>
              );
            }
            const mine = m.user === username;
            const prev = messages[i - 1];
            const showName = !mine && (!prev || prev.type === 'system' || prev.user !== m.user);
            return (
              <div key={m.id} className={`msg ${mine ? 'mine' : ''}`}>
                {showName && <span className="author">{m.user}</span>}
                <div className="bubble">
                  <span className="text">{m.text}</span>
                  <span className="time">{clock(m.time)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="typing" aria-live="polite">
          {typingText}
        </div>

        <form className="composer" onSubmit={send}>
          <input
            value={text}
            onChange={onInput}
            placeholder={connected ? `Message # ${room.name}` : 'Waiting for connection...'}
            disabled={!connected}
            maxLength={1000}
            autoComplete="off"
            aria-label="Message"
          />
          <button type="submit" disabled={!connected || !text.trim()}>
            Send
          </button>
        </form>
        {sendError && <p className="send-error" role="alert">{sendError}</p>}
      </section>
    </div>
  );
}
