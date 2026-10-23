import { useState } from 'react';
import { socket } from './socket.js';
import Login from './components/Login.jsx';
import Chat from './components/Chat.jsx';

export default function App() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const join = (username, room) => {
    setBusy(true);
    setError('');
    if (!socket.connected) socket.connect();
    socket.timeout(5000).emit('join', { username, room }, (err, res) => {
      setBusy(false);
      if (err) {
        socket.disconnect();
        setError('Cannot reach the chat server. Is the backend running on port 5000?');
        return;
      }
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSession(res);
    });
  };

  const leave = (message = '') => {
    socket.disconnect();
    setSession(null);
    setError(message);
  };

  if (!session) return <Login onJoin={join} busy={busy} error={error} />;
  return <Chat initial={session} onLeave={leave} />;
}
