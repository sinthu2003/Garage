/**
 * ============================================
 * AUTH CONTEXT
 * ============================================
 * 
 * Manages authentication state across the app:
 * - Login/Logout functionality
 * - Token persistence
 * - User state
 * - Protected route handling
 * 
 * @file src/context/AuthContext.tsx
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi, tokenStorage, getErrorMessage } from '../services/api';
import type { AuthUser } from '../services/api';

// ============================================
// TYPES
// ============================================

interface AuthContextValue {
  /** Current authenticated user */
  user: AuthUser | null;
  /** Whether auth state is being loaded */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Login error message */
  error: string | null;
  /** Login function */
  login: (email: string, password: string) => Promise<boolean>;
  /** Logout function */
  logout: () => Promise<void>;
  /** Clear error */
  clearError: () => void;
  /** Check if user has specific role */
  hasRole: (role: 'admin' | 'editor' | 'viewer') => boolean;
  /** Check if user can edit content */
  canEdit: boolean;
  /** Check if user is admin */
  isAdmin: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------------------------------
  // State
  // ----------------------------------------
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------
  // Derived state
  // ----------------------------------------
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  // ----------------------------------------
  // Initialize auth state from storage
  // ----------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a stored token
        if (tokenStorage.isAuthenticated()) {
          // Try to get user from storage first (for quick UI)
          const storedUser = tokenStorage.getUser();
          if (storedUser) {
            setUser(storedUser);
          }

          // Verify token is still valid by fetching user profile
          try {
            const currentUser = await authApi.getMe();
            setUser(currentUser);
            tokenStorage.setUser(currentUser);
          } catch (err) {
            // Token invalid, clear everything
            console.warn('Token validation failed:', err);
            tokenStorage.clearTokens();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        tokenStorage.clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ----------------------------------------
  // Login
  // ----------------------------------------
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Note: Don't set isLoading here - that's for initial auth check only
    // The login component handles its own isSubmitting state
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);

      // Get the redirect path (if any)
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

      // Navigate to intended destination or admin dashboard
      navigate(from, { replace: true });

      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Login error:', err);
      return false;
    }
  }, [navigate, location.state]);

  // ----------------------------------------
  // Logout
  // ----------------------------------------
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout errors, still clear local state
      console.warn('Logout API error (ignored):', err);
    } finally {
      setUser(null);
      setIsLoading(false);
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // ----------------------------------------
  // Clear error
  // ----------------------------------------
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ----------------------------------------
  // Role check
  // ----------------------------------------
  const hasRole = useCallback((role: 'admin' | 'editor' | 'viewer'): boolean => {
    if (!user) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    // Editor has editor and viewer permissions
    if (user.role === 'editor' && (role === 'editor' || role === 'viewer')) return true;

    // Viewer only has viewer permission
    if (user.role === 'viewer' && role === 'viewer') return true;

    return false;
  }, [user]);

  // ----------------------------------------
  // Context value
  // ----------------------------------------
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      error,
      login,
      logout,
      clearError,
      hasRole,
      canEdit,
      isAdmin,
    }),
    [user, isLoading, isAuthenticated, error, login, logout, clearError, hasRole, canEdit, isAdmin]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// HOOKS
// ============================================

/**
 * Hook to access auth context
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 * 
 * @example
 * // In a protected component
 * const { user } = useRequireAuth();
 */
export const useRequireAuth = (requiredRole?: 'admin' | 'editor' | 'viewer') => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isAuthenticated) {
        // Redirect to login, saving the attempted URL
        navigate('/admin/login', {
          replace: true,
          state: { from: location },
        });
      } else if (requiredRole && !auth.hasRole(requiredRole)) {
        // User doesn't have required role
        navigate('/admin/unauthorized', { replace: true });
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.hasRole, requiredRole, navigate, location]);

  return auth;
};

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'viewer';
  fallback?: React.ReactNode;
}

/**
 * Wrapper component for protected routes
 * 
 * @example
 * <Route path="/admin" element={
 *   <ProtectedRoute requiredRole="editor">
 *     <AdminPage />
 *   </ProtectedRoute>
 * } />
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { isLoading, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', {
        replace: true,
        state: { from: location },
      });
    }
  }, [isLoading, isAuthenticated, navigate, location]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ============================================
// EXPORTS
// ============================================

export { AuthContext };
export type { AuthContextValue, AuthProviderProps };