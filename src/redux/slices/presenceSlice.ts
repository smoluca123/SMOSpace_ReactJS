import { IUserPresenceUpdate, UserPresenceStatus } from '@/lib/sockets';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface PresenceState {
  // Map of userId -> status. A user not present in this map is considered offline.
  onlineUsers: Record<string, Exclude<UserPresenceStatus, 'offline'>>;
}

const initialState: PresenceState = {
  onlineUsers: {},
};

const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    // Replace the whole snapshot (used on initial connection).
    setOnlineUsers: (state, action: PayloadAction<IUserPresenceUpdate[]>) => {
      const next: PresenceState['onlineUsers'] = {};
      action.payload.forEach(({ userId, status }) => {
        if (status !== 'offline') {
          next[userId] = status;
        }
      });
      state.onlineUsers = next;
    },
    // Apply a single presence change (online/away/busy/offline).
    setUserPresence: (state, action: PayloadAction<IUserPresenceUpdate>) => {
      const { userId, status, isOnline } = action.payload;
      if (!isOnline || status === 'offline') {
        delete state.onlineUsers[userId];
      } else {
        state.onlineUsers[userId] = status;
      }
    },
    resetPresence: (state) => {
      state.onlineUsers = {};
    },
  },
});

export const { reducer: presenceReducer } = presenceSlice;
export const { setOnlineUsers, setUserPresence, resetPresence } = presenceSlice.actions;

export const selectPresence = (state: RootState) => state.presence;
export const selectOnlineUsers = (state: RootState) => state.presence.onlineUsers;
export const selectIsUserOnline = (userId?: string) => (state: RootState) =>
  userId ? Boolean(state.presence.onlineUsers[userId]) : false;
export const selectUserStatus =
  (userId?: string) =>
  (state: RootState): UserPresenceStatus =>
    userId ? state.presence.onlineUsers[userId] || 'offline' : 'offline';
