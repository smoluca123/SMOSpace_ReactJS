import { authReducer } from '@/redux/slices/authSlice';
import { postReducer } from '@/redux/slices/postSlice';
import { configureStore } from '@reduxjs/toolkit';
import { dialogReducer } from './slices/dialogSlice';
import { presenceReducer } from './slices/presenceSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    dialog: dialogReducer,
    presence: presenceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
