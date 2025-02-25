import { socket } from '@/lib/socket';
import { useEffect } from 'react';

export function usePostSocket() {
  useEffect(() => {
    socket.connect();
  }, []);
}
