/**
 * ReportsScreen - Visual reports of task completion history
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList } from '../types';
import { useTasks } from '../context/TaskContext';
import { getTodayString } from '../utils/dateUtils';
import { theme, CzechText } from '../theme';
import CompletionChart from '../components/CompletionChart';

type ReportsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Reports'>;
};

export default function ReportsScreen({ navigation }: ReportsScreenProps) {
  const { tasks, getCompletionStats, getStreak } = useTasks();
  const today = getTodayString();

  // Calculate date 7 days ago
  const sevenDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date.toISOString().split('T')[0];
  }, []);

  // Get stats for last 7 days
  const weekStats = useMemo(() => {
    return getCompletionStats(sevenDaysAgo, today);
  }, [getCompletionStats, sevenDaysAgo, today]);

  // Get current streak
  const streak = useMemo(() => getStreak(), [getStreak]);

  // Total active tasks count
  const totalTasks = useMemo(() => {
    return tasks.filter(t => t.isActive && t.notificationTime).length;
  }, [tasks]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Přehled úkolů</Text>
          <Text style={styles.headerSubtitle}>Posledních 7 dní</Text>
        </View>

        {/* Stats cards */}
        <View style={styles.statsRow}>
          {/* Completion rate */}
          <Card style={styles.statCard}>
            <Card.Content style={styles.statCardContent}>
              <Text style={styles.statValue}>{weekStats.completionRate}%</Text>
              <Text style={styles.statLabel}>Úspěšnost</Text>
            </Card.Content>
          </Card>

          {/* Total tracked */}
          <Card style={styles.statCard}>
            <Card.Content style={styles.statCardContent}>
              <Text style={styles.statValue}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Úkolů</Text>
            </Card.Content>
          </Card>

          {/* Streak */}
          <Card style={styles.statCard}>
            <Card.Content style={styles.statCardContent}>
              <View style={styles.streakContainer}>
                <Text style={styles.statValue}>{streak}</Text>
                <Icon name="fire" size={20} color={theme.colors.secondary} />
              </View>
              <Text style={styles.statLabel}>Série dní</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Pie Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Splněné vs Nesplněné</Text>
            <CompletionChart
              completed={weekStats.completed}
              incomplete={weekStats.incomplete}
            />
          </Card.Content>
        </Card>

        {/* View details button */}
        <Button
          mode="contained"
          icon="calendar-text"
          onPress={() => navigation.navigate('DayDetail', { date: today })}
          style={styles.detailsButton}
          contentStyle={styles.detailsButtonContent}
        >
          {CzechText.viewDetails}
        </Button>

        {/* Summary info */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Icon name="check-circle" size={24} color={theme.custom.success} />
                <Text style={styles.summaryValue}>{weekStats.completed}</Text>
                <Text style={styles.summaryLabel}>{CzechText.completed}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Icon name="close-circle" size={24} color={theme.colors.error} />
                <Text style={styles.summaryValue}>{weekStats.incomplete}</Text>
                <Text style={styles.summaryLabel}>{CzechText.incomplete}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Icon name="sigma" size={24} color={theme.colors.primary} />
                <Text style={styles.summaryValue}>{weekStats.total}</Text>
                <Text style={styles.summaryLabel}>{CzechText.total}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartCard: {
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  detailsButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  detailsButtonContent: {
    paddingVertical: 8,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: theme.colors.outlineVariant,
  },
});
