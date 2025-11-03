import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, authenticateUser, getUserById } from '@/lib/auth';
import { tokenStorage } from '@/lib/auth-storage';
import { hasPermission as checkRBACPermission, canAccessRoute as checkRBACRouteAccess } from '@/lib/rbac';
import { UserRole } from '@/utils/enum';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const userData = await authenticateUser(credentials);
      if (userData) {
        // Save user session data
        tokenStorage.setUserSession(userData, false);
        return userData;
      }
      return rejectWithValue('Invalid credentials');
    } catch (error) {
      return rejectWithValue('Login failed');
    }
  }
);

// Async thunk for checking existing session
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const userSession = tokenStorage.getUserSession();
      if (userSession) {
        // Update last activity
        tokenStorage.updateLastActivity();
        return userSession as User;
      }
      return rejectWithValue('No saved session');
    } catch (error) {
      tokenStorage.clearUserSession();
      return rejectWithValue('Auth check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      tokenStorage.clearUserSession();
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { logout, clearError, setLoading } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

// Helper functions - Use RBAC system
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  // Use RBAC system based on user role
  return checkRBACPermission(user.role as UserRole, permission);
};

export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;
  // Use RBAC system based on user role
  return checkRBACRouteAccess(user.role as UserRole, route);
};

export default authSlice.reducer;
