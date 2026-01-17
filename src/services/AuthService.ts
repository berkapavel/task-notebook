/**
 * Authentication Service
 * Handles parent registration, login, and password verification
 */

import CryptoJS from 'crypto-js';
import { AuthData } from '../types';
import { AuthStorage } from './StorageService';

// Minimum password length
const MIN_PASSWORD_LENGTH = 4;

// Salt for password hashing (fixed for this app - sufficient for family use)
const SALT = 'TaskNotebook_2024_Salt';

/**
 * Hash a password using SHA-256 with salt
 */
function hashPassword(password: string): string {
  return CryptoJS.SHA256(password + SALT).toString();
}

/**
 * Verify a password against stored hash
 */
function verifyPassword(password: string, storedHash: string): boolean {
  const inputHash = hashPassword(password);
  return inputHash === storedHash;
}

/**
 * Validate password meets requirements
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Heslo musí mít alespoň ${MIN_PASSWORD_LENGTH} znaky`,
    };
  }
  return { valid: true };
}

/**
 * Validate passwords match
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): { valid: boolean; error?: string } {
  if (password !== confirmPassword) {
    return {
      valid: false,
      error: 'Hesla se neshodují',
    };
  }
  return { valid: true };
}

/**
 * Auth Service API
 */
export const AuthService = {
  /**
   * Check if a parent is already registered
   */
  async isParentRegistered(): Promise<boolean> {
    const authData = await AuthStorage.get();
    return authData?.isParentRegistered ?? false;
  },

  /**
   * Register a new parent (only if none exists)
   */
  async register(password: string): Promise<{ success: boolean; error?: string }> {
    // Check if parent already registered
    const isRegistered = await this.isParentRegistered();
    if (isRegistered) {
      return {
        success: false,
        error: 'Rodič je již zaregistrován',
      };
    }

    // Validate password
    const validation = validatePassword(password);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Hash and store
    const passwordHash = hashPassword(password);
    const authData: AuthData = {
      isParentRegistered: true,
      passwordHash,
    };

    const saved = await AuthStorage.set(authData);
    if (!saved) {
      return {
        success: false,
        error: 'Nepodařilo se uložit registraci',
      };
    }

    return { success: true };
  },

  /**
   * Login with password
   */
  async login(password: string): Promise<{ success: boolean; error?: string }> {
    const authData = await AuthStorage.get();

    if (!authData?.isParentRegistered) {
      return {
        success: false,
        error: 'Žádný rodič není zaregistrován',
      };
    }

    const isValid = verifyPassword(password, authData.passwordHash);
    if (!isValid) {
      return {
        success: false,
        error: 'Nesprávné heslo',
      };
    }

    return { success: true };
  },

  /**
   * Get current auth status
   */
  async getAuthStatus(): Promise<{
    isParentRegistered: boolean;
  }> {
    const authData = await AuthStorage.get();
    return {
      isParentRegistered: authData?.isParentRegistered ?? false,
    };
  },

  /**
   * Clear all auth data (for testing/reset purposes)
   */
  async clearAuth(): Promise<boolean> {
    return AuthStorage.clear();
  },
};
