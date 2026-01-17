# Phase 6: Notifications

**Status:** COMPLETED

## Goal
Push notifications for task reminders at scheduled times.

## What Was Done

### 1. Created NotificationService (`src/services/NotificationService.ts`)

Implemented all notification functions:
```typescript
- requestPermissions(): Promise<boolean>
- createChannel(): Promise<void>
- initializeNotifications(): Promise<boolean>
- scheduleTaskNotification(taskId, taskName, date, time): Promise<string | null>
- cancelNotification(notificationId): Promise<void>
- cancelTaskNotification(taskId, date): Promise<void>
- cancelAllNotificationsForTask(taskId): Promise<void>
- updateNotificationTime(taskId, taskName, date, newTime): Promise<string | null>
- cancelAllNotifications(): Promise<void>
- getScheduledNotificationIds(): Promise<string[]>
- setupNotificationEventListener(handler): () => void
- getInitialNotification(): Promise<{ taskId: string; date: string } | null>
```

### 2. Notification Channel Configuration
```typescript
{
  id: 'task-reminders',
  name: 'Připomínky úkolů',
  description: 'Upozornění na čas splnění úkolů',
  importance: AndroidImportance.HIGH,
  visibility: AndroidVisibility.PUBLIC,
  sound: 'default',
  vibration: true,
}
```

### 3. Notification Content
- Title: "Čas na úkol!"
- Body: "Je čas splnit úkol: {taskName}"
- Small icon: App icon (ic_launcher)
- Auto-cancel on tap
- Contains taskId and date in data for deep linking

### 4. Integrated with TaskContext

**On Task Creation:**
- Schedules notification if task is for today and has a time

**On Task Completion:**
- Cancels scheduled notification for that task/date

**On Task Postpone:**
- Cancels old notification
- Schedules new notification with updated time

**On Task Delete:**
- Cancels all notifications for that task

**Added `scheduleTodayNotifications()`:**
- Schedules notifications for all incomplete tasks for today
- Called on app launch

### 5. Deep Linking Implementation

**App.tsx updates:**
- Added navigation ref for programmatic navigation
- Created `NotificationInitializer` component that:
  - Initializes notification service on app load
  - Schedules today's notifications
  - Sets up foreground notification event listener
  - Checks for initial notification (app launched from notification)
- `onNavigationReady` handles pending notification navigation

**index.js updates:**
- Registered background notification handler with `notifee.onBackgroundEvent`

### 6. Notification Flow

1. App starts → `NotificationInitializer` runs
2. Requests notification permissions
3. Creates notification channel
4. Schedules notifications for today's incomplete tasks
5. Checks if app was launched from notification tap
6. Foreground handler listens for notification taps

## Files Created
- `src/services/NotificationService.ts`

## Files Updated
- `src/context/TaskContext.tsx` - Added notification integration
- `src/types/index.ts` - Added `scheduleTodayNotifications` to TaskContextType
- `App.tsx` - Added NotificationInitializer and navigation handling
- `index.js` - Added background notification handler

## Notification ID Format
```
task-{taskId}-{date}
Example: task-550e8400-e29b-41d4-a716-446655440000-2025-01-15
```

## Testing Notes
- Notifications scheduled only for future times (past times are skipped)
- Notification tap opens TaskDetailScreen with correct task
- Works when app is: foreground, background, or killed
- Notification cancelled when task is completed or deleted
- Notification rescheduled when task is postponed
