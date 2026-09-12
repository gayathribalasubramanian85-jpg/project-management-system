import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logout as apiLogout } from '../services/authService.js';

/**
 * AuthContext — global authentication state.
 *
 * On mount, calls GET /api/auth/me to restore the user from the existing
 * httpOnly cookie (survives page refresh without storing anything in
 * localStorage — the cookie does the work).
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until initial check done

  // ─── Restore session on page load / refresh ───────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        // No valid cookie — user is not logged in, that's fine
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  /** Called after a successful login or register API response. */
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  /** Calls the logout API, then clears local state. */
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Even if the API call fails, clear client state
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isAuth: !!user,
    authLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume auth context.
 * Throws if used outside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
