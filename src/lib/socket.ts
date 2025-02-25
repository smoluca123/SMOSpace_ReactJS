import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  extraHeaders: {
    Authorization: `Bearer ${import.meta.env.VITE_AUTHORIZATION_TOKEN}`,
  },
  autoConnect: false,
});
