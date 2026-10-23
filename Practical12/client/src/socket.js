import { io } from 'socket.io-client';

// Same-origin connection: Vite proxies /socket.io to the backend in development,
// and Express serves everything together in production.
export const socket = io({ autoConnect: false });
