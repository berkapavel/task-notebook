# Phase 2: Authentication System

**Status:** COMPLETED

## Goal
Parent registration and login functionality with password protection.

## What Was Done

### 1. AuthService Implementation
- Password hashing using SHA-256 with salt (crypto-js)
- Minimum 4 character password requirement
- Password validation and matching functions
- Single parent registration (prevents duplicate registrations)

### 2. AuthContext Implementation
- React Context for global auth state
- State: `isLoading`, `isParentRegistered`, `isLoggedIn`
- Actions: `register()`, `login()`, `logout()`, `checkAuthStatus()`
- Auto-checks registration status on app launch

### 3. Screens Created

**RegisterScreen** (`src/screens/RegisterScreen.tsx`)
- Password input with visibility toggle
- Confirm password field
- Validation error messages in Czech
- Loading state during registration

**LoginScreen** (`src/screens/LoginScreen.tsx`)
- Password input with visibility toggle
- Error message for incorrect password
- Loading state during login

### Files Created

| File | Purpose |
|------|---------|
| `src/services/AuthService.ts` | Password hashing, validation, login/register logic |
| `src/context/AuthContext.tsx` | Auth state management + useAuth hook |
| `src/screens/RegisterScreen.tsx` | Parent registration form |
| `src/screens/LoginScreen.tsx` | Parent login form |

### Files Updated

| File | Changes |
|------|---------|
| `App.tsx` | Added AuthProvider, conditional navigation based on login state |

## Auth Flow

1. **First launch:** "Registrovat rodiče" button visible (no parent registered)
2. **After registration:** Button changes to "Přihlásit se", auto-login
3. **After login:** App shows Admin screen
4. **After logout:** Returns to child/guest view (Main screen)

## Security Notes
- Password stored as SHA-256 hash with fixed salt
- Sufficient for family app use case (not enterprise security)
- No username required - single parent per device
