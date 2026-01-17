/**
 * Authentication Context
 * Provides auth state and actions throughout the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthService } from '../services/AuthService';
import { AuthContextType, AuthState } from '../types';

// Initial state
const initialState: AuthState = {
  isLoading: true,
  isParentRegistered: false,
  isLoggedIn: false,
};

// Create context with undefined default (will be provided by provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  /**
   * Check auth status on mount
   */
  const checkAuthStatus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const status = await AuthService.getAuthStatus();
      setState({
        isLoading: false,
        isParentRegistered: status.isParentRegistered,
        isLoggedIn: false, // Always start logged out
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setState({
        isLoading: false,
        isParentRegistered: false,
        isLoggedIn: false,
      });
    }
  }, []);

  /**
   * Register new parent
   */
  const register = useCallback(async (password: string): Promise<boolean> => {
    const result = await AuthService.register(password);

    if (result.success) {
      setState(prev => ({
        ...prev,
        isParentRegistered: true,
        isLoggedIn: true, // Auto-login after registration
      }));
      return true;
    }

    return false;
  }, []);

  /**
   * Login with password
   */
  const login = useCallback(async (password: string): Promise<boolean> => {
    const result = await AuthService.login(password);

    if (result.success) {
      setState(prev => ({
        ...prev,
        isLoggedIn: true,
      }));
      return true;
    }

    return false;
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoggedIn: false,
    }));
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const contextValue: AuthContextType = {
    ...state,
    register,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Hook to check if user is admin (logged in parent)
 */
export function useIsAdmin(): boolean {
  const { isLoggedIn } = useAuth();
  return isLoggedIn;
}
