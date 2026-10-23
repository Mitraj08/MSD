import { useState } from 'react';

const ROOMS = ['General', 'Random', 'Tech'];

export default function Login({ onJoin, busy, error }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState(ROOMS[0]);

  const submit = (e) => {
    e.preventDefault();
    if (username.trim().length >= 2) onJoin(username.trim(), room);
  };

  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <h1>Live Chat</h1>
        <p className="lead">Pick a name and jump into a room.</p>

        <label htmlFor="username">Your name</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          autoFocus
          autoComplete="off"
          placeholder="e.g. Maya"
        />

        <label htmlFor="room">Room</label>
        <select id="room" value={room} onChange={(e) => setRoom(e.target.value)}>
          {ROOMS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" disabled={busy || username.trim().length < 2}>
          {busy ? 'Connecting...' : 'Join chat'}
        </button>
      </form>
    </div>
  );
}
