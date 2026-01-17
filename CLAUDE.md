# TaskNotebook - Project Context for Claude

## Overview

TaskNotebook is a React Native mobile application for family task management. It helps parents create and manage daily tasks for their children while providing children with an engaging, gamified experience.

## Language & Localization

**IMPORTANT:** The app is fully localized in Czech. All UI text, labels, error messages, and encouraging messages must be in Czech.

## Technical Stack

- **Framework:** React Native 0.83.1 with TypeScript
- **UI:** React Native Paper (Material Design)
- **Navigation:** React Navigation (Native Stack)
- **Storage:** AsyncStorage for local persistence
- **Notifications:** Notifee
- **Charts:** react-native-chart-kit with react-native-svg
- **Date Handling:** date-fns
- **Security:** crypto-js for SHA-256 password hashing

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/
│   ├── admin/        # Parent admin screens
│   └── child/        # Child view screens
├── services/         # Business logic (Storage, Auth, Notification, Export/Import, Achievement)
├── context/          # React Context providers (Auth, Task)
├── hooks/            # Custom React hooks
├── utils/            # Utility functions (dateUtils)
├── types/            # TypeScript interfaces
└── theme/            # Theming and Czech translations
```

## Key Data Models

### Task
```typescript
interface Task {
  id: string;
  name: string;
  description?: string;
  daysOfWeek: DayOfWeek[];    // 1-7 (Mon-Sun)
  notificationTime?: string;  // "HH:mm" or undefined for warnings
  createdAt: string;          // YYYY-MM-DD
  isActive: boolean;
}
```

### DailyTaskState
```typescript
interface DailyTaskState {
  id: string;
  taskId: string;
  date: string;           // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  postponeCount: number;
  currentTime: string;
}
```

## Key Features

### Child View
- Daily task list with completion and postpone functionality
- Warning alerts section (tasks without notification time)
- Progress bar, confetti animations, encouragement messages
- Achievement system with 10 unlockable badges
- Reports with completion charts and statistics

### Admin Panel (Parent)
- Password-protected access
- Full CRUD for tasks with day scheduling
- Task templates for common routines
- Data export/import as JSON
- Statistics dashboard

## Development Commands

```bash
npm install          # Install dependencies
npm run android      # Run on Android
npm run start        # Start Metro bundler
npm run lint         # Run ESLint
npm test             # Run Jest tests
```

## Target Platform

Android (primary). iOS support possible with additional configuration.

## Code Conventions

- Use TypeScript strict mode
- Follow React Native Paper design patterns
- All user-facing strings in Czech
- Use date-fns for date operations
- Store dates as YYYY-MM-DD strings
- Store times as HH:mm strings
