/**
 * App Theme Configuration
 * Child-friendly colors with Material Design 3
 */

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Child-friendly color palette
const colors = {
  // Primary - playful purple
  primary: '#7C4DFF',
  primaryContainer: '#E8DDFF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#21005E',

  // Secondary - cheerful orange
  secondary: '#FF9800',
  secondaryContainer: '#FFE0B2',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#2E1500',

  // Tertiary - friendly teal
  tertiary: '#26A69A',
  tertiaryContainer: '#B2DFDB',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#00201E',

  // Success - task completed green
  success: '#4CAF50',
  successContainer: '#C8E6C9',
  onSuccess: '#FFFFFF',
  onSuccessContainer: '#1B5E20',

  // Warning - alert yellow/orange
  warning: '#FFC107',
  warningContainer: '#FFF8E1',
  onWarning: '#000000',
  onWarningContainer: '#5D4037',

  // Error - soft red
  error: '#E57373',
  errorContainer: '#FFCDD2',
  onError: '#FFFFFF',
  onErrorContainer: '#B71C1C',

  // Background
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454E',

  // Outline
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
};

// Light theme (default)
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryContainer,
    onPrimary: colors.onPrimary,
    onPrimaryContainer: colors.onPrimaryContainer,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryContainer,
    onSecondary: colors.onSecondary,
    onSecondaryContainer: colors.onSecondaryContainer,
    tertiary: colors.tertiary,
    tertiaryContainer: colors.tertiaryContainer,
    onTertiary: colors.onTertiary,
    onTertiaryContainer: colors.onTertiaryContainer,
    error: colors.error,
    errorContainer: colors.errorContainer,
    onError: colors.onError,
    onErrorContainer: colors.onErrorContainer,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onBackground: colors.onBackground,
    onSurface: colors.onSurface,
    onSurfaceVariant: colors.onSurfaceVariant,
    outline: colors.outline,
    outlineVariant: colors.outlineVariant,
  },
  // Custom colors for the app
  custom: {
    success: colors.success,
    successContainer: colors.successContainer,
    onSuccess: colors.onSuccess,
    onSuccessContainer: colors.onSuccessContainer,
    warning: colors.warning,
    warningContainer: colors.warningContainer,
    onWarning: colors.onWarning,
    onWarningContainer: colors.onWarningContainer,
  },
};

// Dark theme (for future use)
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#B9A0FF',
    primaryContainer: '#5600E8',
    onPrimary: '#3700B3',
    secondary: '#FFB74D',
    secondaryContainer: '#E65100',
    tertiary: '#4DB6AC',
    tertiaryContainer: '#00695C',
    background: '#1C1B1F',
    surface: '#2D2D30',
    surfaceVariant: '#3D3D40',
  },
  custom: {
    success: '#81C784',
    successContainer: '#2E7D32',
    onSuccess: '#1B5E20',
    onSuccessContainer: '#C8E6C9',
    warning: '#FFD54F',
    warningContainer: '#F57F17',
    onWarning: '#000000',
    onWarningContainer: '#FFF8E1',
  },
};

// Type for theme
export type AppTheme = typeof lightTheme;

// Default export
export const theme = lightTheme;

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  warningBox: {
    backgroundColor: colors.warningContainer,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  counterBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};

// Encouraging messages for task completion (Czech)
export const encouragingMessages = [
  'Skvělá práce!',
  'Jsi úžasný/á!',
  'Tak držíš!',
  'Super!',
  'Výborně!',
  'Jen tak dál!',
  'Máš to!',
  'Paráda!',
  'Bomba!',
  'Jedničkář/ka!',
  'Šampion!',
  'Hvězda!',
  'Pecka!',
  'Hustý!',
  'Takhle se to dělá!',
];

// Get random encouraging message
export const getRandomEncouragement = (): string => {
  const index = Math.floor(Math.random() * encouragingMessages.length);
  return encouragingMessages[index];
};

// Czech text constants
export const CzechText = {
  // App
  appName: 'Zápisník úkolů',
  appSubtitle: 'Domácí práce s radostí',

  // Auth
  login: 'Přihlásit se',
  register: 'Registrovat rodiče',
  logout: 'Odhlásit se',
  password: 'Heslo',
  confirmPassword: 'Potvrdit heslo',
  loginError: 'Nesprávné heslo',
  registerSuccess: 'Registrace úspěšná',
  passwordMismatch: 'Hesla se neshodují',
  passwordTooShort: 'Heslo musí mít alespoň 4 znaky',

  // Navigation
  home: 'Domů',
  tasks: 'Úkoly',
  reports: 'Přehledy',
  settings: 'Nastavení',
  admin: 'Administrace',

  // Tasks
  addTask: 'Přidat úkol',
  editTask: 'Upravit úkol',
  deleteTask: 'Smazat úkol',
  taskName: 'Název úkolu',
  taskDescription: 'Popis (volitelné)',
  notificationTime: 'Čas upozornění',
  noTime: 'Bez času (upozornění)',
  selectDays: 'Vyberte dny',
  save: 'Uložit',
  cancel: 'Zrušit',
  delete: 'Smazat',
  confirmDelete: 'Opravdu chcete smazat tento úkol?',

  // Task completion
  completeTask: 'Dokončit úkol',
  confirmComplete: 'Opravdu jsi úkol splnil/a?',
  yes: 'Ano',
  no: 'Ne',
  taskCompleted: 'Úkol splněn!',

  // Postpone
  postpone: 'Odložit',
  postponeBy: 'Odložit o',
  minutes: 'minut',
  cannotPostpone: 'Nelze odložit na další den',
  maxPostpones: 'Úkol byl již odložen 2×',
  postponeRemaining: 'Zbývá odložení:',

  // Counters
  incomplete: 'Nesplněné',
  completed: 'Splněné',
  total: 'Celkem',

  // Days
  today: 'Dnes',
  tomorrow: 'Zítra',
  yesterday: 'Včera',

  // Reports
  viewDetails: 'Zobrazit detaily',
  noData: 'Žádná data',
  taskHistory: 'Historie úkolů',

  // Export/Import
  exportData: 'Exportovat data',
  importData: 'Importovat data',
  exportTasks: 'Exportovat úkoly',
  exportReports: 'Exportovat přehledy',
  exportAll: 'Exportovat vše',
  importSuccess: 'Import úspěšný',
  importError: 'Chyba při importu',

  // Notifications
  notificationTitle: 'Čas na úkol!',
  notificationBody: (taskName: string) => `Je čas splnit úkol: ${taskName}`,

  // Warnings (tasks without time)
  warningsTitle: 'Nezapomeň!',
  noWarnings: 'Žádná upozornění',
  canBeCompletedLabel: 'Lze označit jako splněné',
  canBeCompletedDescription: 'Dítě může označit tento úkol jako splněný',

  // Empty states
  noTasks: 'Žádné úkoly',
  noTasksForToday: 'Na dnešek nemáš žádné úkoly',
  allTasksCompleted: 'Všechny úkoly splněny!',

  // Admin
  parentOnly: 'Pouze pro rodiče',
  allTasks: 'Všechny úkoly',
  filterByDay: 'Filtrovat podle dne',
  dataManagement: 'Správa dat',

  // Clear data
  clearData: 'Smazat data',
  clearDataDescription: 'Smaže všechny úkoly, historii a úspěchy. Heslo rodiče zůstane zachováno.',
  clearDataConfirmTitle: 'Smazat všechna data?',
  clearDataConfirmMessage: 'Tato akce je nevratná. Všechny úkoly, historie plnění a úspěchy budou smazány.',
  clearDataSuccess: 'Data byla smazána',
  clearDataError: 'Nepodařilo se smazat data',

  // Notification permissions
  notificationPermissionTitle: 'Upozornění nejsou povolena',
  notificationPermissionMessage: 'Pro připomínky úkolů je potřeba povolit upozornění.',
  exactAlarmPermissionTitle: 'Přesné budíky nejsou povoleny',
  exactAlarmPermissionMessage: 'Pro spolehlivé připomínky je potřeba povolit přesné budíky.',
  batteryOptimizationTitle: 'Optimalizace baterie',
  batteryOptimizationMessage: 'Vypněte optimalizaci baterie pro spolehlivé připomínky.',
  openSettings: 'Otevřít nastavení',
  permissionDismiss: 'Později',
};
