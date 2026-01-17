/**
 * Task Context
 * Provides task state and operations throughout the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, DailyTaskState, TaskWithState, TaskContextType, CompletionStats, DailyStats } from '../types';
import { TasksStorage, DailyStatesStorage } from '../services/StorageService';
import { getTodayString, getDayOfWeek, shouldTaskAppearOnDate, getDateString } from '../utils/dateUtils';
import * as NotificationService from '../services/NotificationService';

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * Task Provider component
 */
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyStates, setDailyStates] = useState<DailyTaskState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load all tasks and daily states from storage
   */
  const refreshTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const [loadedTasks, loadedStates] = await Promise.all([
        TasksStorage.getAll(),
        DailyStatesStorage.getAll(),
      ]);
      setTasks(loadedTasks);
      setDailyStates(loadedStates);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new task
   */
  const addTask = useCallback(async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'isActive'>
  ): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: getTodayString(),
      isActive: true,
    };

    await TasksStorage.add(newTask);
    setTasks(prev => [...prev, newTask]);

    // Schedule notification if task is for today and has a time
    const today = getTodayString();
    if (newTask.notificationTime && shouldTaskAppearOnDate(newTask.createdAt, newTask.daysOfWeek, today)) {
      await NotificationService.scheduleTaskNotification(
        newTask.id,
        newTask.name,
        today,
        newTask.notificationTime
      );
    }

    return newTask;
  }, []);

  /**
   * Update an existing task
   */
  const updateTask = useCallback(async (updatedTask: Task): Promise<void> => {
    await TasksStorage.update(updatedTask);
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

    // Reschedule notification for today if task has a time and is scheduled for today
    const today = getTodayString();

    // Cancel existing notification first
    await NotificationService.cancelTaskNotification(updatedTask.id, today);

    // Schedule new notification if task is active and for today
    if (updatedTask.isActive && updatedTask.notificationTime &&
        shouldTaskAppearOnDate(updatedTask.createdAt, updatedTask.daysOfWeek, today)) {
      await NotificationService.scheduleTaskNotification(
        updatedTask.id,
        updatedTask.name,
        today,
        updatedTask.notificationTime
      );
    }
  }, []);

  /**
   * Delete a task
   */
  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    // Cancel all notifications for this task
    await NotificationService.cancelAllNotificationsForTask(taskId);

    await TasksStorage.delete(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  /**
   * Mark a task as completed for a specific date
   */
  const completeTask = useCallback(async (taskId: string, date: string): Promise<void> => {
    const task = tasks.find(t => t.id === taskId);
    // Can complete if task has time OR is a warning with canBeCompleted flag
    if (!task) return;
    if (!task.notificationTime && !task.canBeCompleted) return;

    // Cancel notification for this task/date (only if it has a time)
    if (task.notificationTime) {
      await NotificationService.cancelTaskNotification(taskId, date);
    }

    const existingState = dailyStates.find(
      s => s.taskId === taskId && s.date === date
    );

    const newState: DailyTaskState = {
      id: existingState?.id || uuidv4(),
      taskId,
      date,
      completed: true,
      completedAt: new Date().toISOString(),
      postponeCount: existingState?.postponeCount || 0,
      currentTime: existingState?.currentTime || task.notificationTime || '',
    };

    await DailyStatesStorage.upsert(newState);
    setDailyStates(prev => {
      const filtered = prev.filter(s => !(s.taskId === taskId && s.date === date));
      return [...filtered, newState];
    });
  }, [tasks, dailyStates]);

  /**
   * Postpone a task's notification time
   */
  const postponeTask = useCallback(async (
    taskId: string,
    date: string,
    newTime: string
  ): Promise<boolean> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.notificationTime) return false;

    const existingState = dailyStates.find(
      s => s.taskId === taskId && s.date === date
    );

    const currentPostponeCount = existingState?.postponeCount || 0;
    if (currentPostponeCount >= 2) return false; // Max 2 postpones

    // Update notification with new time
    await NotificationService.updateNotificationTime(taskId, task.name, date, newTime);

    const newState: DailyTaskState = {
      id: existingState?.id || uuidv4(),
      taskId,
      date,
      completed: false,
      postponeCount: currentPostponeCount + 1,
      currentTime: newTime,
    };

    await DailyStatesStorage.upsert(newState);
    setDailyStates(prev => {
      const filtered = prev.filter(s => !(s.taskId === taskId && s.date === date));
      return [...filtered, newState];
    });

    return true;
  }, [tasks, dailyStates]);

  /**
   * Get tasks for a specific date with their daily states
   */
  const getDailyTasks = useCallback((date: string): TaskWithState[] => {
    const dayOfWeek = getDayOfWeek(date);

    return tasks
      .filter(task => {
        // Task must be active
        if (!task.isActive) return false;
        // Task must be scheduled for this day of week
        if (!task.daysOfWeek.includes(dayOfWeek)) return false;
        // Task must have been created on or before this date
        if (task.createdAt > date) return false;
        return true;
      })
      .map(task => {
        const dailyState = dailyStates.find(
          s => s.taskId === task.id && s.date === date
        );
        return {
          ...task,
          dailyState,
        };
      })
      .sort((a, b) => {
        // Tasks without time first (warnings)
        if (!a.notificationTime && b.notificationTime) return -1;
        if (a.notificationTime && !b.notificationTime) return 1;
        // Then sort by time
        if (a.notificationTime && b.notificationTime) {
          return a.notificationTime.localeCompare(b.notificationTime);
        }
        // Finally by name
        return a.name.localeCompare(b.name);
      });
  }, [tasks, dailyStates]);

  /**
   * Schedule notifications for all incomplete tasks for today
   * Call this on app launch to ensure all notifications are set
   */
  const scheduleTodayNotifications = useCallback(async (): Promise<void> => {
    const today = getTodayString();
    const dayOfWeek = getDayOfWeek(today);

    // Get today's tasks directly to avoid circular dependency
    const todayTasks = tasks
      .filter(task => {
        if (!task.isActive) return false;
        if (!task.daysOfWeek.includes(dayOfWeek)) return false;
        if (task.createdAt > today) return false;
        return true;
      })
      .map(task => {
        const dailyState = dailyStates.find(
          s => s.taskId === task.id && s.date === today
        );
        return { ...task, dailyState };
      });

    for (const taskWithState of todayTasks) {
      // Skip tasks without notification time (warnings)
      if (!taskWithState.notificationTime) continue;

      // Skip completed tasks
      if (taskWithState.dailyState?.completed) continue;

      // Get the current time (may be postponed)
      const currentTime = taskWithState.dailyState?.currentTime || taskWithState.notificationTime;

      // Schedule the notification
      await NotificationService.scheduleTaskNotification(
        taskWithState.id,
        taskWithState.name,
        today,
        currentTime
      );
    }
  }, [tasks, dailyStates]);

  /**
   * Get completion statistics for a date range
   */
  const getCompletionStats = useCallback((startDate: string, endDate: string): CompletionStats => {
    let completed = 0;
    let incomplete = 0;

    // Iterate through each day in the range
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dayOfWeek = getDayOfWeek(currentDate);

      // Get tasks that should appear on this day
      const dayTasks = tasks.filter(task => {
        if (!task.isActive) return false;
        // Count tasks with time OR completable warnings
        if (!task.notificationTime && !task.canBeCompleted) return false;
        if (!task.daysOfWeek.includes(dayOfWeek)) return false;
        if (task.createdAt > currentDate) return false;
        return true;
      });

      dayTasks.forEach(task => {
        const state = dailyStates.find(s => s.taskId === task.id && s.date === currentDate);
        if (state?.completed) {
          completed++;
        } else {
          incomplete++;
        }
      });

      // Move to next day
      const date = new Date(currentDate);
      date.setDate(date.getDate() + 1);
      currentDate = date.toISOString().split('T')[0];
    }

    const total = completed + incomplete;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, incomplete, total, completionRate };
  }, [tasks, dailyStates]);

  /**
   * Get detailed statistics for a specific day
   */
  const getDailyStats = useCallback((date: string): DailyStats => {
    const tasksWithState = getDailyTasks(date);

    // Count tasks with time OR completable warnings
    const completableTasks = tasksWithState.filter(t => t.notificationTime || t.canBeCompleted);
    const completedCount = completableTasks.filter(t => t.dailyState?.completed).length;
    const incompleteCount = completableTasks.filter(t => !t.dailyState?.completed).length;

    return {
      date,
      tasks: tasksWithState,
      completedCount,
      incompleteCount,
      totalCount: completableTasks.length,
    };
  }, [getDailyTasks]);

  /**
   * Get current streak (consecutive days with 100% completion)
   */
  const getStreak = useCallback((): number => {
    let streak = 0;
    let daysChecked = 0;
    const today = getTodayString();
    let checkDate = today;

    while (daysChecked < 365) {
      daysChecked++;
      const stats = getDailyStats(checkDate);

      // If there are no tasks for this day, skip it (don't break streak)
      if (stats.totalCount === 0) {
        // Move to previous day
        const date = new Date(checkDate);
        date.setDate(date.getDate() - 1);
        checkDate = date.toISOString().split('T')[0];
        continue;
      }

      // Check if all tasks are completed
      if (stats.completedCount === stats.totalCount) {
        streak++;
        // Move to previous day
        const date = new Date(checkDate);
        date.setDate(date.getDate() - 1);
        checkDate = date.toISOString().split('T')[0];
      } else {
        break;
      }
    }

    return streak;
  }, [getDailyStats]);

  // Load tasks on mount
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const contextValue: TaskContextType = {
    tasks,
    dailyStates,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    postponeTask,
    getDailyTasks,
    refreshTasks,
    scheduleTodayNotifications,
    getCompletionStats,
    getDailyStats,
    getStreak,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Hook to use task context
 */
export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);

  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  return context;
}
