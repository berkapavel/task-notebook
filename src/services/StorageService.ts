/**
 * Storage Service - handles all AsyncStorage operations
 * Provides CRUD operations for tasks, daily states, auth, and settings
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthData,
  Task,
  DailyTaskState,
  AppSettings,
  StorageKeys,
  ExportData,
} from '../types';

/**
 * Generic storage helper functions
 */
async function getItem<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return null;
  }
}

async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
    return false;
  }
}

async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
}

/**
 * Auth Storage Operations
 */
export const AuthStorage = {
  async get(): Promise<AuthData | null> {
    return getItem<AuthData>(StorageKeys.AUTH);
  },

  async set(data: AuthData): Promise<boolean> {
    return setItem(StorageKeys.AUTH, data);
  },

  async clear(): Promise<boolean> {
    return removeItem(StorageKeys.AUTH);
  },
};

/**
 * Tasks Storage Operations
 */
export const TasksStorage = {
  async getAll(): Promise<Task[]> {
    const tasks = await getItem<Task[]>(StorageKeys.TASKS);
    return tasks || [];
  },

  async save(tasks: Task[]): Promise<boolean> {
    return setItem(StorageKeys.TASKS, tasks);
  },

  async add(task: Task): Promise<boolean> {
    const tasks = await this.getAll();
    tasks.push(task);
    return this.save(tasks);
  },

  async update(updatedTask: Task): Promise<boolean> {
    const tasks = await this.getAll();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index === -1) return false;
    tasks[index] = updatedTask;
    return this.save(tasks);
  },

  async delete(taskId: string): Promise<boolean> {
    const tasks = await this.getAll();
    const filtered = tasks.filter(t => t.id !== taskId);
    return this.save(filtered);
  },

  async getById(taskId: string): Promise<Task | undefined> {
    const tasks = await this.getAll();
    return tasks.find(t => t.id === taskId);
  },

  async getByDay(dayOfWeek: number): Promise<Task[]> {
    const tasks = await this.getAll();
    return tasks.filter(t => t.isActive && t.daysOfWeek.includes(dayOfWeek as any));
  },
};

/**
 * Daily States Storage Operations
 */
export const DailyStatesStorage = {
  async getAll(): Promise<DailyTaskState[]> {
    const states = await getItem<DailyTaskState[]>(StorageKeys.DAILY_STATES);
    return states || [];
  },

  async save(states: DailyTaskState[]): Promise<boolean> {
    return setItem(StorageKeys.DAILY_STATES, states);
  },

  async getForDate(date: string): Promise<DailyTaskState[]> {
    const states = await this.getAll();
    return states.filter(s => s.date === date);
  },

  async getForTask(taskId: string, date: string): Promise<DailyTaskState | undefined> {
    const states = await this.getAll();
    return states.find(s => s.taskId === taskId && s.date === date);
  },

  async upsert(state: DailyTaskState): Promise<boolean> {
    const states = await this.getAll();
    const index = states.findIndex(
      s => s.taskId === state.taskId && s.date === state.date
    );
    if (index === -1) {
      states.push(state);
    } else {
      states[index] = state;
    }
    return this.save(states);
  },

  async getDateRange(startDate: string, endDate: string): Promise<DailyTaskState[]> {
    const states = await this.getAll();
    return states.filter(s => s.date >= startDate && s.date <= endDate);
  },
};

/**
 * Settings Storage Operations
 */
export const SettingsStorage = {
  async get(): Promise<AppSettings> {
    const settings = await getItem<AppSettings>(StorageKeys.SETTINGS);
    return settings || {};
  },

  async set(settings: AppSettings): Promise<boolean> {
    return setItem(StorageKeys.SETTINGS, settings);
  },

  async update(partial: Partial<AppSettings>): Promise<boolean> {
    const current = await this.get();
    return this.set({ ...current, ...partial });
  },
};

/**
 * Export/Import Operations
 */
export const DataExportImport = {
  async exportData(
    includeTasks: boolean,
    includeReports: boolean
  ): Promise<ExportData> {
    const exportData: ExportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };

    if (includeTasks) {
      exportData.tasks = await TasksStorage.getAll();
    }

    if (includeReports) {
      exportData.dailyStates = await DailyStatesStorage.getAll();
    }

    return exportData;
  },

  async importData(data: ExportData): Promise<{ tasksImported: number; statesImported: number }> {
    let tasksImported = 0;
    let statesImported = 0;

    if (data.tasks && data.tasks.length > 0) {
      const existingTasks = await TasksStorage.getAll();
      const existingIds = new Set(existingTasks.map(t => t.id));

      for (const task of data.tasks) {
        if (!existingIds.has(task.id)) {
          existingTasks.push(task);
          tasksImported++;
        }
        // Skip duplicates (don't update existing)
      }

      await TasksStorage.save(existingTasks);
    }

    if (data.dailyStates && data.dailyStates.length > 0) {
      const existingStates = await DailyStatesStorage.getAll();
      const existingKeys = new Set(
        existingStates.map(s => `${s.taskId}_${s.date}`)
      );

      for (const state of data.dailyStates) {
        const key = `${state.taskId}_${state.date}`;
        if (!existingKeys.has(key)) {
          existingStates.push(state);
          statesImported++;
        }
        // Skip duplicates (don't update existing)
      }

      await DailyStatesStorage.save(existingStates);
    }

    return { tasksImported, statesImported };
  },

  async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        StorageKeys.AUTH,
        StorageKeys.TASKS,
        StorageKeys.DAILY_STATES,
        StorageKeys.SETTINGS,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },

  /**
   * Clear all app data except authentication (keeps parent password)
   */
  async clearAppData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        StorageKeys.TASKS,
        StorageKeys.DAILY_STATES,
        StorageKeys.SETTINGS,
        StorageKeys.ACHIEVEMENTS,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing app data:', error);
      return false;
    }
  },
};
