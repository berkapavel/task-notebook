/**
 * Admin Dashboard Screen
 * Main admin view with quick stats and navigation
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, FAB, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList, DAY_NAMES_SHORT, DayOfWeek } from '../../types';
import { CzechText, theme as appTheme } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Admin'>;
};

export default function AdminDashboard({ navigation }: Props) {
  const theme = useTheme();
  const { tasks } = useTasks();
  const { logout } = useAuth();

  // Calculate stats
  const activeTasks = tasks.filter(t => t.isActive);
  const tasksWithTime = activeTasks.filter(t => t.notificationTime);
  const tasksWithoutTime = activeTasks.filter(t => !t.notificationTime);

  // Count tasks per day
  const tasksPerDay: Record<DayOfWeek, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0,
  };
  activeTasks.forEach(task => {
    task.daysOfWeek.forEach(day => {
      tasksPerDay[day]++;
    });
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineLarge" style={{ color: theme.colors.onPrimaryContainer }}>
                {activeTasks.length}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
                Celkem úkolů
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineLarge" style={{ color: theme.colors.onSecondaryContainer }}>
                {tasksWithTime.length}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                S časem
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: appTheme.custom.warningContainer }]}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineLarge" style={{ color: appTheme.custom.onWarningContainer }}>
                {tasksWithoutTime.length}
              </Text>
              <Text variant="bodyMedium" style={{ color: appTheme.custom.onWarningContainer }}>
                Upozornění
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Tasks per day */}
        <Card style={styles.card}>
          <Card.Title title="Úkoly podle dnů" />
          <Card.Content>
            <View style={styles.daysGrid}>
              {([1, 2, 3, 4, 5, 6, 7] as DayOfWeek[]).map(day => (
                <View
                  key={day}
                  style={[
                    styles.dayItem,
                    {
                      backgroundColor: tasksPerDay[day] > 0
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  <Text
                    variant="labelLarge"
                    style={{
                      color: tasksPerDay[day] > 0
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurfaceVariant,
                    }}
                  >
                    {DAY_NAMES_SHORT[day]}
                  </Text>
                  <Text
                    variant="titleMedium"
                    style={{
                      color: tasksPerDay[day] > 0
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurfaceVariant,
                    }}
                  >
                    {tasksPerDay[day]}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Title title="Rychlé akce" />
          <Card.Content>
            <Button
              mode="contained"
              icon="format-list-bulleted"
              onPress={() => navigation.navigate('AdminTaskList')}
              style={styles.actionButton}
            >
              {CzechText.allTasks}
            </Button>

            <Button
              mode="contained-tonal"
              icon="plus"
              onPress={() => navigation.navigate('AdminTaskForm', {})}
              style={styles.actionButton}
            >
              {CzechText.addTask}
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              icon="database-export"
              onPress={() => navigation.navigate('AdminDataManagement')}
              style={styles.actionButton}
            >
              {CzechText.dataManagement}
            </Button>
          </Card.Content>
        </Card>

        {/* Logout */}
        <Button
          mode="text"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          {CzechText.logout}
        </Button>
      </ScrollView>

      {/* FAB for adding task */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('AdminTaskForm', {})}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    minWidth: 42,
  },
  actionButton: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  logoutButton: {
    margin: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
