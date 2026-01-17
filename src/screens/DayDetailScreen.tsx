/**
 * DayDetailScreen - Detailed view of tasks for a specific day
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList, TaskWithState } from '../types';
import { useTasks } from '../context/TaskContext';
import { formatDateWithDay, getTodayString } from '../utils/dateUtils';
import { theme, CzechText } from '../theme';

type DayDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DayDetail'>;
  route: RouteProp<RootStackParamList, 'DayDetail'>;
};

function TaskItem({ task, showCompletedTime }: { task: TaskWithState; showCompletedTime?: boolean }) {
  const isCompleted = task.dailyState?.completed;
  const time = task.dailyState?.currentTime || task.notificationTime;
  const completedAt = task.dailyState?.completedAt;

  // Format completion time
  const completedTimeStr = completedAt
    ? new Date(completedAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <View style={styles.taskItem}>
      <View style={styles.taskLeft}>
        <Icon
          name={isCompleted ? 'check-circle' : 'circle-outline'}
          size={24}
          color={isCompleted ? theme.custom.success : theme.colors.outline}
        />
        <View style={styles.taskInfo}>
          <Text style={[styles.taskName, isCompleted && styles.taskNameCompleted]}>
            {task.name}
          </Text>
          {task.description && (
            <Text style={styles.taskDescription} numberOfLines={1}>
              {task.description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.taskRight}>
        {time && (
          <Text style={styles.taskTime}>{time}</Text>
        )}
        {showCompletedTime && completedTimeStr && (
          <Text style={styles.completedTime}>
            {completedTimeStr}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function DayDetailScreen({ navigation, route }: DayDetailScreenProps) {
  const { date } = route.params;
  const { getDailyStats } = useTasks();
  const today = getTodayString();

  // Get stats for the selected date
  const stats = useMemo(() => getDailyStats(date), [getDailyStats, date]);

  // Separate tasks into completed and incomplete (only completable tasks)
  const { completedTasks, incompleteTasks, warningTasks } = useMemo(() => {
    const completed: TaskWithState[] = [];
    const incomplete: TaskWithState[] = [];
    const warnings: TaskWithState[] = [];

    stats.tasks.forEach(task => {
      if (!task.notificationTime) {
        warnings.push(task);
      } else if (task.dailyState?.completed) {
        completed.push(task);
      } else {
        incomplete.push(task);
      }
    });

    return { completedTasks: completed, incompleteTasks: incomplete, warningTasks: warnings };
  }, [stats.tasks]);

  // Navigate to previous/next day
  const navigateDay = (offset: number) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + offset);
    const newDate = currentDate.toISOString().split('T')[0];
    navigation.setParams({ date: newDate });
  };

  const formattedDate = formatDateWithDay(date);
  const isToday = date === today;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Date navigation header */}
      <View style={styles.dateNav}>
        <IconButton
          icon="chevron-left"
          size={28}
          onPress={() => navigateDay(-1)}
        />
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          {isToday && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>{CzechText.today}</Text>
            </View>
          )}
        </View>
        <IconButton
          icon="chevron-right"
          size={28}
          onPress={() => navigateDay(1)}
          disabled={date >= today}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Stats summary */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: theme.colors.errorContainer }]}>
            <Text style={[styles.statCount, { color: theme.colors.error }]}>
              {incompleteTasks.length}
            </Text>
            <Text style={styles.statLabel}>{CzechText.incomplete}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.custom.successContainer }]}>
            <Text style={[styles.statCount, { color: theme.custom.success }]}>
              {completedTasks.length}
            </Text>
            <Text style={styles.statLabel}>{CzechText.completed}</Text>
          </View>
        </View>

        {/* Warning tasks */}
        {warningTasks.length > 0 && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Icon name="alert" size={20} color={theme.custom.warning} />
                <Text style={styles.sectionTitle}>{CzechText.warningsTitle}</Text>
                <Text style={styles.sectionCount}>({warningTasks.length})</Text>
              </View>
              {warningTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Incomplete tasks */}
        {incompleteTasks.length > 0 && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Icon name="clock-outline" size={20} color={theme.colors.error} />
                <Text style={styles.sectionTitle}>{CzechText.incomplete}</Text>
                <Text style={styles.sectionCount}>({incompleteTasks.length})</Text>
              </View>
              {incompleteTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Icon name="check-all" size={20} color={theme.custom.success} />
                <Text style={styles.sectionTitle}>{CzechText.completed}</Text>
                <Text style={styles.sectionCount}>({completedTasks.length})</Text>
              </View>
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} showCompletedTime />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Empty state */}
        {stats.tasks.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank" size={64} color={theme.colors.outline} />
            <Text style={styles.emptyText}>{CzechText.noTasksForToday}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    backgroundColor: theme.colors.surface,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    textTransform: 'capitalize',
  },
  todayBadge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  todayBadgeText: {
    fontSize: 12,
    color: theme.colors.onPrimaryContainer,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statCount: {
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  sectionCount: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskInfo: {
    marginLeft: 12,
    flex: 1,
  },
  taskName: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  taskNameCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.onSurfaceVariant,
  },
  taskDescription: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  taskRight: {
    alignItems: 'flex-end',
  },
  taskTime: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  completedTime: {
    fontSize: 12,
    color: theme.custom.success,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.outline,
    marginTop: 16,
    textAlign: 'center',
  },
});
