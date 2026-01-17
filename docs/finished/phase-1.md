# Phase 1: Project Setup & Core Infrastructure

**Status:** COMPLETED

## Goal
Initialize React Native project with all dependencies and basic structure.

## What Was Done

### 1. Project Initialization
- Created React Native project using `@react-native-community/cli`
- Target platform: Android
- TypeScript enabled by default

### 2. Dependencies Installed
```bash
npm install react-native-paper react-native-safe-area-context react-native-vector-icons
npm install @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/native-stack react-native-screens
npm install @notifee/react-native
npm install date-fns uuid crypto-js
npm install --save-dev @types/uuid @types/react-native-vector-icons @types/crypto-js
```

### 3. Folder Structure Created
```
src/
├── components/     # Reusable UI components
├── screens/
│   ├── admin/      # Admin panel screens
│   └── child/      # Child view screens
├── navigation/     # Navigation config
├── services/       # Storage, notifications, auth
├── hooks/          # Custom React hooks
├── context/        # React Context providers
├── utils/          # Utility functions
└── types/          # TypeScript interfaces
```

### 4. Files Created

| File | Purpose |
|------|---------|
| `src/types/index.ts` | TypeScript interfaces (Task, DailyTaskState, AuthData, navigation types) |
| `src/services/StorageService.ts` | AsyncStorage CRUD operations + export/import helpers |
| `src/theme/index.ts` | Material Design theme + Czech translations (CzechText) |
| `src/utils/dateUtils.ts` | Date/time utilities using date-fns |
| `App.tsx` | Main entry with Paper + Navigation providers |

### 5. Android Configuration
- Updated `android/app/src/main/res/values/strings.xml` with Czech app name "Zápisník úkolů"

## Key Data Models Defined

```typescript
// Task definition
interface Task {
  id: string;
  name: string;
  description?: string;
  daysOfWeek: DayOfWeek[]; // 1-7 (Mon-Sun)
  notificationTime?: string; // "HH:mm" or undefined for warnings
  createdAt: string; // YYYY-MM-DD
  isActive: boolean;
}

// Daily task state
interface DailyTaskState {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  postponeCount: number;
  currentTime: string;
}
```

## Storage Keys
- `@tasknotebook_auth` - Parent authentication
- `@tasknotebook_tasks` - All tasks
- `@tasknotebook_daily_states` - Daily completion states
- `@tasknotebook_settings` - App settings
