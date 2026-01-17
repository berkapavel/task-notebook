/**
 * Task Notebook - Zápisník úkolů: Domácí práce s radostí
 * Main Application Entry Point
 */

import React, { useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, View, Text, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { theme, CzechText } from './src/theme';
import { RootStackParamList } from './src/types';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TaskProvider, useTasks } from './src/context/TaskContext';
import * as NotificationService from './src/services/NotificationService';

// Auth Screens
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';

// Child Screens
import MainScreen from './src/screens/child/MainScreen';
import TaskDetailScreen from './src/screens/child/TaskDetailScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import DayDetailScreen from './src/screens/DayDetailScreen';

// Admin Screens
import AdminDashboard from './src/screens/admin/AdminDashboard';
import TaskListScreen from './src/screens/admin/TaskListScreen';
import TaskFormScreen from './src/screens/admin/TaskFormScreen';
import DataManagementScreen from './src/screens/admin/DataManagementScreen';

// Loading screen
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Načítání...</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

// Global navigation ref for deep linking
const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

/**
 * Navigate to a screen (used for notification deep linking)
 */
function navigateToTask(taskId: string, date: string) {
  if (navigationRef.current?.isReady()) {
    // Navigate to TaskDetail screen
    navigationRef.current.navigate('TaskDetail', { taskId, date });
  }
}

// Pending notification to handle after navigation is ready
let pendingNotification: { taskId: string; date: string } | null = null;

/**
 * Component that initializes notifications and schedules today's reminders
 * Must be inside TaskProvider to access scheduleTodayNotifications
 */
function NotificationInitializer() {
  const { scheduleTodayNotifications, isLoading } = useTasks();
  const hasInitialized = useRef(false);

  useEffect(() => {
    async function initialize() {
      if (hasInitialized.current || isLoading) return;
      hasInitialized.current = true;

      // Initialize notification service
      const result = await NotificationService.initializeNotifications();
      console.log('Notification permission:', result.hasNotificationPermission);
      console.log('Exact alarm permission:', result.hasExactAlarmPermission);
      console.log('Battery optimization disabled:', result.hasBatteryOptimizationDisabled);

      // Prompt user if exact alarm permission is missing (one-time alert)
      if (result.hasNotificationPermission && !result.hasExactAlarmPermission) {
        Alert.alert(
          'Povolení pro upozornění',
          'Pro správné fungování připomínek je potřeba povolit přesné budíky. Chcete otevřít nastavení?',
          [
            { text: 'Ne', style: 'cancel' },
            {
              text: 'Otevřít nastavení',
              onPress: () => NotificationService.openExactAlarmSettings(),
            },
          ]
        );
      }

      // Prompt user if battery optimization is enabled (one-time alert)
      if (result.hasNotificationPermission && result.hasExactAlarmPermission && !result.hasBatteryOptimizationDisabled) {
        Alert.alert(
          'Optimalizace baterie',
          'Pro spolehlivé připomínky doporučujeme vypnout optimalizaci baterie pro tuto aplikaci.',
          [
            { text: 'Později', style: 'cancel' },
            {
              text: 'Otevřít nastavení',
              onPress: () => NotificationService.openBatteryOptimizationSettings(),
            },
          ]
        );
      }

      if (result.hasNotificationPermission) {
        // Schedule notifications for today's tasks
        await scheduleTodayNotifications();
        console.log('Scheduled today\'s notifications');
      }

      // Check if app was launched from a notification
      const initialNotification = await NotificationService.getInitialNotification();
      if (initialNotification) {
        // Store it to navigate after navigation is ready
        pendingNotification = initialNotification;
      }
    }

    initialize();
  }, [scheduleTodayNotifications, isLoading]);

  // Set up foreground notification handler
  useEffect(() => {
    const unsubscribe = NotificationService.setupNotificationEventListener(
      (taskId, date) => {
        navigateToTask(taskId, date);
      }
    );

    return unsubscribe;
  }, []);

  return null;
}

// Main navigator component (needs to be inside AuthProvider and TaskProvider)
function AppNavigator() {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      {isLoggedIn ? (
        // Admin screens (logged in)
        <>
          <Stack.Screen
            name="Admin"
            component={AdminDashboard}
            options={{
              title: CzechText.admin,
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="AdminTaskList"
            component={TaskListScreen}
            options={{ title: CzechText.allTasks }}
          />
          <Stack.Screen
            name="AdminTaskForm"
            component={TaskFormScreen}
            options={{ title: CzechText.addTask }}
          />
          <Stack.Screen
            name="AdminDataManagement"
            component={DataManagementScreen}
            options={{ title: CzechText.dataManagement }}
          />
        </>
      ) : (
        // Child/Guest screens
        <>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ title: CzechText.appName }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{ title: 'Detail úkolu' }}
          />
          <Stack.Screen
            name="Reports"
            component={ReportsScreen}
            options={{ title: CzechText.reports }}
          />
          <Stack.Screen
            name="DayDetail"
            component={DayDetailScreen}
            options={{ title: CzechText.taskHistory }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: CzechText.register }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: CzechText.login }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function App(): React.JSX.Element {
  // Handle pending notification after navigation is ready
  const onNavigationReady = () => {
    if (pendingNotification) {
      navigateToTask(pendingNotification.taskId, pendingNotification.date);
      pendingNotification = null;
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.primary}
        />
        <AuthProvider>
          <TaskProvider>
            <NotificationInitializer />
            <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
              <AppNavigator />
            </NavigationContainer>
          </TaskProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default App;
