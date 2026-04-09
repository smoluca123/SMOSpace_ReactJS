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
  isAdmin: boolean;
}

export const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
export const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
export const isAdmin =
  currentUser?.userType.typeName === 'MODERATOR' ||
  currentUser?.userType.typeName === 'SUPER_ADMIN';

const initialState: AuthState = {
  isAuthenticated,
  user: currentUser,
  isLoading: false,
  isAdmin,
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
      const accessToken = JSON.parse(localStorage.getItem('currentUser') || '{}').accessToken;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { accessToken: _accessToken, ...rest } = action.payload;
      const newUser = {
        ...state.user,
        ...rest,
        accessToken,
      };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return {
        ...state,
        user: newUser,
        isAdmin:
          action.payload.userType.typeName === 'MODERATOR' ||
          action.payload.userType.typeName === 'SUPER_ADMIN',
      };
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
    decreaseUserCredits(state, { payload = 1 }: { payload: number }) {
      if (state.user) {
        state.user = {
          ...state.user,
          credits: state.user.credits - payload,
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
        state.isAdmin =
          action.payload.data.userType.typeName === 'MODERATOR' ||
          action.payload.data.userType.typeName === 'SUPER_ADMIN';
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
export const { logout, updateUser, updateUserCredits, decreaseUserCredits } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
