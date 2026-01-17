/**
 * TypeScript types for Task Notebook application
 * Zápisník úkolů: Domácí práce s radostí
 */

// Day of week constants (1 = Monday, 7 = Sunday)
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Czech day names for UI
export const DAY_NAMES: Record<DayOfWeek, string> = {
  1: 'Pondělí',
  2: 'Úterý',
  3: 'Středa',
  4: 'Čtvrtek',
  5: 'Pátek',
  6: 'Sobota',
  7: 'Neděle',
};

// Short Czech day names for compact UI
export const DAY_NAMES_SHORT: Record<DayOfWeek, string> = {
  1: 'Po',
  2: 'Út',
  3: 'St',
  4: 'Čt',
  5: 'Pá',
  6: 'So',
  7: 'Ne',
};

/**
 * Authentication data stored locally
 */
export interface AuthData {
  isParentRegistered: boolean;
  passwordHash: string;
}

/**
 * Task definition created by parent
 */
export interface Task {
  id: string; // UUID
  name: string;
  description?: string;
  daysOfWeek: DayOfWeek[]; // Which days the task appears
  notificationTime?: string; // "HH:mm" format, undefined = warning task
  canBeCompleted?: boolean; // For warning tasks: if true, child can mark as done
  createdAt: string; // ISO date string (YYYY-MM-DD)
  isActive: boolean;
}

/**
 * Daily state of a task (completion status for a specific day)
 */
export interface DailyTaskState {
  id: string; // UUID
  taskId: string;
  date: string; // "YYYY-MM-DD"
  completed: boolean;
  completedAt?: string; // ISO datetime string
  postponeCount: number; // 0-2, max 2 postpones allowed
  currentTime: string; // Current notification time after postpones "HH:mm"
}

/**
 * App settings stored locally
 */
export interface AppSettings {
  colorTheme?: string; // For Phase 9: child color preference
  lastOpenedDate?: string; // Track when app was last opened
}

/**
 * Combined task data for display (Task + DailyTaskState)
 */
export interface TaskWithState extends Task {
  dailyState?: DailyTaskState;
}

/**
 * Export data structure
 */
export interface ExportData {
  version: string;
  exportedAt: string;
  tasks?: Task[];
  dailyStates?: DailyTaskState[];
}

/**
 * Storage keys enum for AsyncStorage
 */
export enum StorageKeys {
  AUTH = '@tasknotebook_auth',
  TASKS = '@tasknotebook_tasks',
  DAILY_STATES = '@tasknotebook_daily_states',
  SETTINGS = '@tasknotebook_settings',
  ACHIEVEMENTS = '@tasknotebook_achievements',
}

/**
 * Navigation param types
 */
export type RootStackParamList = {
  Main: undefined;
  TaskDetail: { taskId: string; date: string };
  Reports: undefined;
  DayDetail: { date: string };
  Register: undefined;
  Login: undefined;
  Admin: undefined;
  AdminTaskList: undefined;
  AdminTaskForm: { taskId?: string }; // undefined = new task, string = edit existing
  AdminDataManagement: undefined;
};

/**
 * Auth context state
 */
export interface AuthState {
  isLoading: boolean;
  isParentRegistered: boolean;
  isLoggedIn: boolean;
}

/**
 * Auth context actions
 */
export interface AuthContextType extends AuthState {
  register: (password: string) => Promise<boolean>;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

/**
 * Completion statistics
 */
export interface CompletionStats {
  completed: number;
  incomplete: number;
  total: number;
  completionRate: number; // 0-100
}

/**
 * Daily statistics with task details
 */
export interface DailyStats {
  date: string;
  tasks: TaskWithState[];
  completedCount: number;
  incompleteCount: number;
  totalCount: number;
}

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO datetime when unlocked
}

/**
 * Achievement IDs
 */
export type AchievementId =
  | 'first_task'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'perfect_day'
  | 'early_bird'
  | 'night_owl'
  | 'task_master_10'
  | 'task_master_50'
  | 'task_master_100';

/**
 * Task context state
 */
export interface TaskContextType {
  tasks: Task[];
  dailyStates: DailyTaskState[];
  isLoading: boolean;
  // Task CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isActive'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  // Daily state operations
  completeTask: (taskId: string, date: string) => Promise<void>;
  postponeTask: (taskId: string, date: string, newTime: string) => Promise<boolean>;
  getDailyTasks: (date: string) => TaskWithState[];
  // Data operations
  refreshTasks: () => Promise<void>;
  // Notifications
  scheduleTodayNotifications: () => Promise<void>;
  // Report statistics
  getCompletionStats: (startDate: string, endDate: string) => CompletionStats;
  getDailyStats: (date: string) => DailyStats;
  getStreak: () => number;
}
