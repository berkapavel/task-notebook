/**
 * Notification Service
 * Handles push notifications for task reminders using Notifee
 */

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  TimestampTrigger,
  EventType,
  Event,
  AlarmType,
} from '@notifee/react-native';
import { Platform, Linking } from 'react-native';
import { parse, setHours, setMinutes, isBefore } from 'date-fns';
import { CzechText } from '../theme';

// Notification channel configuration
const CHANNEL_ID = 'task-reminders';
const CHANNEL_NAME = 'Připomínky úkolů';
const CHANNEL_DESCRIPTION = 'Upozornění na čas splnění úkolů';

// Notification ID prefix for task notifications
const NOTIFICATION_ID_PREFIX = 'task-';

/**
 * Generate a unique notification ID for a task on a specific date
 */
export function getNotificationId(taskId: string, date: string): string {
  return `${NOTIFICATION_ID_PREFIX}${taskId}-${date}`;
}

/**
 * Parse notification ID to extract taskId and date
 */
export function parseNotificationId(notificationId: string): { taskId: string; date: string } | null {
  if (!notificationId.startsWith(NOTIFICATION_ID_PREFIX)) {
    return null;
  }

  const parts = notificationId.replace(NOTIFICATION_ID_PREFIX, '').split('-');
  if (parts.length < 4) { // UUID has 4 dashes + date parts
    return null;
  }

  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  // Date format: YYYY-MM-DD
  // Combined: task-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-YYYY-MM-DD
  const dateParts = parts.slice(-3);
  const uuidParts = parts.slice(0, -3);

  return {
    taskId: uuidParts.join('-'),
    date: dateParts.join('-'),
  };
}

/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1; // Authorized or Provisional
}

/**
 * Check if exact alarm permission is granted (Android 12+)
 */
export async function checkExactAlarmPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const settings = await notifee.getNotificationSettings();
  // AlarmType.ENABLED means exact alarms are allowed
  return settings.android.alarm === AlarmType.ENABLED;
}

/**
 * Open settings for exact alarm permission
 */
export async function openExactAlarmSettings(): Promise<void> {
  if (Platform.OS === 'android') {
    await notifee.openAlarmPermissionSettings();
  }
}

/**
 * Check if battery optimization is disabled for the app (Android)
 * Returns true if battery optimization is disabled (good for notifications)
 */
export async function checkBatteryOptimization(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled();
  // Return true if NOT optimized (battery optimization disabled = good)
  return !batteryOptimizationEnabled;
}

/**
 * Open battery optimization settings
 */
export async function openBatteryOptimizationSettings(): Promise<void> {
  if (Platform.OS === 'android') {
    await notifee.openBatteryOptimizationSettings();
  }
}

/**
 * Create notification channel for Android
 */
export async function createChannel(): Promise<void> {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: CHANNEL_NAME,
    description: CHANNEL_DESCRIPTION,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
    vibration: true,
  });
}

/**
 * Notification initialization result
 */
export interface NotificationInitResult {
  hasNotificationPermission: boolean;
  hasExactAlarmPermission: boolean;
  hasBatteryOptimizationDisabled: boolean;
}

/**
 * Initialize notification service
 * Call this on app startup
 */
export async function initializeNotifications(): Promise<NotificationInitResult> {
  try {
    await createChannel();
    const hasNotificationPermission = await requestPermissions();
    const hasExactAlarmPermission = await checkExactAlarmPermission();
    const hasBatteryOptimizationDisabled = await checkBatteryOptimization();

    if (!hasExactAlarmPermission) {
      console.warn('Exact alarm permission not granted. Scheduled notifications may not work.');
    }

    if (!hasBatteryOptimizationDisabled) {
      console.warn('Battery optimization is enabled. Notifications may be delayed or missed.');
    }

    return {
      hasNotificationPermission,
      hasExactAlarmPermission,
      hasBatteryOptimizationDisabled,
    };
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return {
      hasNotificationPermission: false,
      hasExactAlarmPermission: false,
      hasBatteryOptimizationDisabled: false,
    };
  }
}

/**
 * Calculate the trigger timestamp for a notification
 */
function getNotificationTimestamp(date: string, time: string): number {
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());
  const [hours, minutes] = time.split(':').map(Number);

  const triggerDate = setMinutes(setHours(dateObj, hours), minutes);
  return triggerDate.getTime();
}

/**
 * Schedule a notification for a task
 */
export async function scheduleTaskNotification(
  taskId: string,
  taskName: string,
  date: string,
  time: string
): Promise<string | null> {
  try {
    const notificationId = getNotificationId(taskId, date);
    const timestamp = getNotificationTimestamp(date, time);

    // Don't schedule if time is in the past
    if (isBefore(timestamp, Date.now())) {
      console.log(`Notification time is in the past for task ${taskId} on ${date} at ${time}`);
      return null;
    }

    // Check if we have exact alarm permission
    const hasExactAlarm = await checkExactAlarmPermission();

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
      // Use inexact alarms if exact alarm permission not granted (less precise but works)
      alarmManager: hasExactAlarm ? { allowWhileIdle: true } : false,
    };

    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: CzechText.notificationTitle,
        body: CzechText.notificationBody(taskName),
        android: {
          channelId: CHANNEL_ID,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher', // Uses app icon
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        },
        data: {
          taskId,
          date,
        },
      },
      trigger
    );

    console.log(`Scheduled notification ${notificationId} for ${date} at ${time}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

/**
 * Cancel a specific notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await notifee.cancelNotification(notificationId);
    console.log(`Cancelled notification ${notificationId}`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

/**
 * Cancel notification for a specific task and date
 */
export async function cancelTaskNotification(taskId: string, date: string): Promise<void> {
  const notificationId = getNotificationId(taskId, date);
  await cancelNotification(notificationId);
}

/**
 * Cancel all notifications for a task (all dates)
 */
export async function cancelAllNotificationsForTask(taskId: string): Promise<void> {
  try {
    const notifications = await notifee.getTriggerNotificationIds();
    const taskNotifications = notifications.filter(id =>
      id.startsWith(`${NOTIFICATION_ID_PREFIX}${taskId}`)
    );

    for (const notificationId of taskNotifications) {
      await cancelNotification(notificationId);
    }

    console.log(`Cancelled ${taskNotifications.length} notifications for task ${taskId}`);
  } catch (error) {
    console.error('Error cancelling all notifications for task:', error);
  }
}

/**
 * Update notification time for a postponed task
 */
export async function updateNotificationTime(
  taskId: string,
  taskName: string,
  date: string,
  newTime: string
): Promise<string | null> {
  // Cancel existing notification
  await cancelTaskNotification(taskId, date);

  // Schedule new notification with updated time
  return scheduleTaskNotification(taskId, taskName, date, newTime);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await notifee.cancelAllNotifications();
    console.log('Cancelled all notifications');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
}

/**
 * Get all scheduled notification IDs
 */
export async function getScheduledNotificationIds(): Promise<string[]> {
  return notifee.getTriggerNotificationIds();
}

/**
 * Notification event handler type
 */
export type NotificationEventHandler = (taskId: string, date: string) => void;

/**
 * Set up notification event listener
 * Returns cleanup function
 */
export function setupNotificationEventListener(
  onNotificationPress: NotificationEventHandler
): () => void {
  return notifee.onForegroundEvent(({ type, detail }: Event) => {
    if (type === EventType.PRESS) {
      const { notification } = detail;
      if (notification?.data) {
        const taskId = notification.data.taskId as string;
        const date = notification.data.date as string;
        if (taskId && date) {
          onNotificationPress(taskId, date);
        }
      }
    }
  });
}

/**
 * Handle background notification events
 * This should be called in index.js or App.tsx initialization
 */
export function setupBackgroundHandler(
  onNotificationPress: NotificationEventHandler
): void {
  notifee.onBackgroundEvent(async ({ type, detail }: Event) => {
    if (type === EventType.PRESS) {
      const { notification } = detail;
      if (notification?.data) {
        const taskId = notification.data.taskId as string;
        const date = notification.data.date as string;
        if (taskId && date) {
          onNotificationPress(taskId, date);
        }
      }
    }
  });
}

/**
 * Check initial notification (when app was launched from notification)
 */
export async function getInitialNotification(): Promise<{ taskId: string; date: string } | null> {
  try {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification?.notification?.data) {
      const taskId = initialNotification.notification.data.taskId as string;
      const date = initialNotification.notification.data.date as string;
      if (taskId && date) {
        return { taskId, date };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting initial notification:', error);
    return null;
  }
}

/**
 * Display a test notification immediately (for debugging)
 */
export async function displayTestNotification(): Promise<void> {
  try {
    await notifee.displayNotification({
      title: 'Test notifikace',
      body: 'Toto je testovací upozornění - notifikace fungují!',
      android: {
        channelId: CHANNEL_ID,
        smallIcon: 'ic_launcher',
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        pressAction: {
          id: 'default',
        },
      },
    });
    console.log('Test notification displayed');
  } catch (error) {
    console.error('Error displaying test notification:', error);
  }
}
