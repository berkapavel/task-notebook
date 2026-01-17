/**
 * MainScreen - Child's Daily Task View
 * Shows today's tasks with completion functionality
 * Includes gamification: progress bar, confetti, achievements
 */

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList, TaskWithState, Achievement } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { getTodayString, formatDateWithDay } from '../../utils/dateUtils';
import { theme, CzechText, getRandomEncouragement } from '../../theme';
import { achievementService } from '../../services/AchievementService';

import TaskCounters from '../../components/TaskCounters';
import WarningAlertsSection from '../../components/WarningAlertsSection';
import TaskCard from '../../components/TaskCard';
import ProgressBar from '../../components/ProgressBar';
import Confetti, { ConfettiRef } from '../../components/Confetti';
import EncouragementToast from '../../components/EncouragementToast';
import NotificationPermissionBanner from '../../components/NotificationPermissionBanner';

type MainScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

export default function MainScreen({ navigation }: MainScreenProps) {
  const { getDailyTasks, completeTask, dailyStates, getStreak, isLoading } = useTasks();
  const { isParentRegistered } = useAuth();
  const today = getTodayString();

  // Gamification state
  const confettiRef = useRef<ConfettiRef>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const dailyTasks = useMemo(() => getDailyTasks(today), [getDailyTasks, today]);

  // Load achievements on mount
  useEffect(() => {
    achievementService.loadAchievements();
  }, []);

  // Separate tasks: warnings (no time) and completable (with time)
  const { warningTasks, completableTasks, incompleteTasks, completedTasks } = useMemo(() => {
    const warnings: TaskWithState[] = [];
    const completable: TaskWithState[] = [];
    const incomplete: TaskWithState[] = [];
    const completed: TaskWithState[] = [];

    dailyTasks.forEach(task => {
      if (!task.notificationTime) {
        // Warning tasks (no time)
        warnings.push(task);
        // If canBeCompleted, also count in completable stats
        if (task.canBeCompleted) {
          completable.push(task);
          if (task.dailyState?.completed) {
            completed.push(task);
          } else {
            incomplete.push(task);
          }
        }
      } else {
        // Completable tasks with time
        completable.push(task);
        if (task.dailyState?.completed) {
          completed.push(task);
        } else {
          incomplete.push(task);
        }
      }
    });

    return {
      warningTasks: warnings,
      completableTasks: completable,
      incompleteTasks: incomplete,
      completedTasks: completed,
    };
  }, [dailyTasks]);

  const handleCompleteTask = useCallback(async (taskId: string) => {
    await completeTask(taskId, today);

    // Trigger confetti and encouragement
    confettiRef.current?.fire();
    setEncouragementMessage(getRandomEncouragement());
    setShowEncouragement(true);

    // Check for new achievements
    const streak = getStreak();
    const completedCount = completedTasks.length + 1; // +1 for the just-completed task
    const totalCount = completableTasks.length;

    // Check time-based achievement
    const timeAchievement = await achievementService.checkTimeBasedAchievement();
    if (timeAchievement) {
      setNewAchievement(timeAchievement);
    }

    // Check other achievements
    const newAchievements = await achievementService.checkAchievements(
      dailyStates,
      streak,
      completedCount,
      totalCount
    );

    if (newAchievements.length > 0 && !timeAchievement) {
      setNewAchievement(newAchievements[0]);
    }
  }, [completeTask, today, getStreak, completedTasks.length, completableTasks.length, dailyStates]);

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId, date: today });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const allTasksCompleted = incompleteTasks.length === 0 && completableTasks.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Confetti animation */}
      <Confetti ref={confettiRef} />

      {/* Encouragement toast */}
      <EncouragementToast
        message={encouragementMessage}
        visible={showEncouragement}
        onDismiss={() => setShowEncouragement(false)}
      />

      {/* Achievement notification toast */}
      {newAchievement && (
        <EncouragementToast
          message={`🏆 ${newAchievement.name}!`}
          visible={!!newAchievement}
          onDismiss={() => setNewAchievement(null)}
        />
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Date header */}
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{formatDateWithDay(today)}</Text>
        </View>

        {/* Notification permission warnings */}
        <NotificationPermissionBanner />

        {/* Progress bar */}
        <ProgressBar
          completed={completedTasks.length}
          total={completableTasks.length}
        />

        {/* Task counters */}
        <TaskCounters
          incomplete={incompleteTasks.length}
          completed={completedTasks.length}
        />

        {/* Warning alerts section */}
        <WarningAlertsSection tasks={warningTasks} onComplete={handleCompleteTask} />

        {/* All completed message */}
        {allTasksCompleted && (
          <View style={styles.allCompletedContainer}>
            <Icon name="check-circle" size={48} color={theme.custom.success} />
            <Text style={styles.allCompletedText}>{CzechText.allTasksCompleted}</Text>
          </View>
        )}

        {/* Task list (incomplete only, completed are hidden) */}
        {incompleteTasks.length > 0 && (
          <View style={styles.taskListContainer}>
            <Text style={styles.sectionTitle}>{CzechText.tasks}</Text>
            {incompleteTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onPress={handleTaskPress}
              />
            ))}
          </View>
        )}

        {/* Empty state - no tasks at all for today */}
        {completableTasks.length === 0 && warningTasks.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-check" size={64} color={theme.colors.outline} />
            <Text style={styles.emptyText}>{CzechText.noTasksForToday}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomButtonsContainer}>
        {/* Reports button */}
        <Button
          mode="outlined"
          icon="chart-pie"
          onPress={() => navigation.navigate('Reports')}
          compact
        >
          {CzechText.reports}
        </Button>

        {/* Auth button */}
        {isParentRegistered ? (
          <Button
            mode="outlined"
            icon="account-lock"
            onPress={() => navigation.navigate('Login')}
            compact
          >
            {CzechText.login}
          </Button>
        ) : (
          <Button
            mode="outlined"
            icon="account-plus"
            onPress={() => navigation.navigate('Register')}
            compact
          >
            {CzechText.register}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for auth button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  taskListContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.outline,
    marginTop: 16,
    textAlign: 'center',
  },
  allCompletedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: theme.custom.successContainer,
    borderRadius: 16,
  },
  allCompletedText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.custom.onSuccessContainer,
    marginTop: 12,
    textAlign: 'center',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
