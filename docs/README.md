# TaskNotebook (Zápisník úkolů)

A React Native mobile application for family task management, designed primarily for children with parent administration capabilities.

## Overview

TaskNotebook helps parents create and manage daily tasks for their children while providing children with an engaging, gamified experience to complete their responsibilities. The app features push notifications, achievement systems, and visual progress tracking.

## Key Features

### For Children (Main View)
- **Daily Task List** - View tasks scheduled for the current day
- **Task Completion** - Complete tasks with confirmation dialogs
- **Postpone Feature** - Delay tasks up to 2 times (10-minute increments)
- **Warning Alerts** - Non-timed reminders shown in a special section
- **Progress Tracking** - Visual progress bar showing daily completion
- **Gamification** - Confetti animations, encouraging messages, and achievements
- **Reports** - View completion history with charts and statistics

### For Parents (Admin Panel)
- **Password Protection** - Secure parent-only access with SHA-256 hashing
- **Task Management** - Full CRUD operations for tasks
- **Day Scheduling** - Assign tasks to specific days of the week
- **Time Settings** - Optional notification times for tasks
- **Task Templates** - Pre-made templates for common routines (morning, evening, school)
- **Data Export/Import** - Backup and restore task data as JSON files
- **Statistics Dashboard** - Overview of total tasks and configurations

## Technical Stack

- **Framework**: React Native with TypeScript
- **UI Library**: React Native Paper (Material Design)
- **Navigation**: React Navigation (Native Stack)
- **Storage**: AsyncStorage for local persistence
- **Notifications**: Notifee for push notifications
- **Charts**: react-native-chart-kit with react-native-svg
- **Date Handling**: date-fns
- **Security**: crypto-js for password hashing

## App Structure

```
src/
├── components/       # Reusable UI components
│   ├── TaskCard, TaskForm, TaskCounters
│   ├── DaySelector, TimePicker, PostponeSelector
│   ├── ProgressBar, Confetti, EncouragementToast
│   ├── AchievementBadge, TaskTemplates
│   └── CompletionChart, WarningAlertsSection
├── screens/
│   ├── admin/        # Parent admin screens
│   │   ├── AdminDashboard
│   │   ├── TaskListScreen, TaskFormScreen
│   │   └── DataManagementScreen
│   └── child/        # Child view screens
│       ├── MainScreen
│       └── TaskDetailScreen
├── services/         # Business logic
│   ├── StorageService, AuthService
│   ├── NotificationService
│   ├── ExportService, ImportService
│   └── AchievementService
├── context/          # React Context providers
│   ├── AuthContext
│   └── TaskContext
├── hooks/            # Custom React hooks
├── utils/            # Utility functions (dateUtils)
├── types/            # TypeScript interfaces
└── theme/            # Theming and Czech translations
```

## Data Models

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

### Daily Task State
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

## Achievements System

10 unlockable achievements:
- **První úkol** - Complete your first task
- **3/7/30 dny v řadě** - Completion streaks
- **Perfektní den** - Complete all tasks in one day
- **Ranní ptáče** - Complete task before 8:00
- **Noční sova** - Complete task after 20:00
- **Začátečník/Pokročilý/Mistr** - 10/50/100 total completions

## Language

The app is fully localized in Czech, including:
- All UI text and labels
- Error messages
- Date formatting
- Encouraging messages (15 variations)

## Development Phases

See the `finished/` folder for detailed documentation of each development phase:

1. **Phase 1**: Project Setup & Core Infrastructure
2. **Phase 2**: Authentication System
3. **Phase 3**: Admin Panel - Task Management
4. **Phase 4**: Child View - Daily To-Do List
5. **Phase 5**: Task Details & Postpone Feature
6. **Phase 6**: Notifications
7. **Phase 7**: Reports & Statistics
8. **Phase 8**: Export/Import Functionality
9. **Phase 9**: Polish & Child-Friendly Enhancements

## Getting Started

```bash
# Install dependencies
npm install

# Start emulator (or use 'make physical' for USB device)
make emu

# Build and run the app
make start

# After code changes
make restart
```

See `test.md` for detailed WSL2 setup guide and troubleshooting.

## Target Platform

Currently targeting Android. iOS support possible with additional configuration.
