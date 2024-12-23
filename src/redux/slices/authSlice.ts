import { loginAPI } from '@/apis/userApi';
import { IUserWithAccessTokenType } from '@/lib/types/interfaces';
import { LoginValues } from '@/lib/validations';
import { RootState } from '@/redux/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: IUserWithAccessTokenType | null;
  isLoading: boolean;
  error: { message: string } | null;
}

const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

const initialState: AuthState = {
  isAuthenticated,
  user: currentUser,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: LoginValues) => {
  try {
    const data = await loginAPI(credentials);
    return data;
  } catch (error) {
    console.log('🚀 ~ error:', error);
    throw error;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      window.location.reload();
    },
    updateUser(
      state,
      action: {
        payload: IUserWithAccessTokenType;
      },
    ) {
      state.user = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    updateUserCredits(state, { payload }: { payload: number }) {
      if (state.user) {
        state.user = {
          ...state.user,
          credits: payload,
        };
        localStorage.setItem('currentUser', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.error = null;
        localStorage.setItem('currentUser', JSON.stringify(action.payload.data));
        localStorage.setItem('isAuthenticated', JSON.stringify(true));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = { message: action.error.message || 'Unknow error' };
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { reducer: authReducer } = authSlice;
export const { logout, updateUser, updateUserCredits } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
