/**
 * Task List Screen (Admin)
 * Shows all tasks with filtering by day
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import {
  Text,
  Card,
  Chip,
  IconButton,
  FAB,
  useTheme,
  Divider,
  Menu,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTasks } from '../../context/TaskContext';
import { RootStackParamList, Task, DayOfWeek, DAY_NAMES_SHORT, DAY_NAMES } from '../../types';
import { CzechText, theme as appTheme } from '../../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminTaskList'>;
};

export default function TaskListScreen({ navigation }: Props) {
  const theme = useTheme();
  const { tasks, deleteTask } = useTasks();

  // Filter state
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = tasks.filter(t => t.isActive);

    if (selectedDay !== null) {
      result = result.filter(t => t.daysOfWeek.includes(selectedDay));
    }

    // Sort: tasks without time first, then by time, then by name
    return result.sort((a, b) => {
      if (!a.notificationTime && b.notificationTime) return -1;
      if (a.notificationTime && !b.notificationTime) return 1;
      if (a.notificationTime && b.notificationTime) {
        return a.notificationTime.localeCompare(b.notificationTime);
      }
      return a.name.localeCompare(b.name);
    });
  }, [tasks, selectedDay]);

  const handleDelete = (task: Task) => {
    Alert.alert(
      CzechText.deleteTask,
      CzechText.confirmDelete,
      [
        { text: CzechText.cancel, style: 'cancel' },
        {
          text: CzechText.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
          },
        },
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Card style={styles.taskCard}>
      <Card.Content style={styles.taskContent}>
        <View style={styles.taskMain}>
          {/* Task info */}
          <View style={styles.taskInfo}>
            <View style={styles.taskHeader}>
              <Text variant="titleMedium" style={styles.taskName}>
                {item.name}
              </Text>
              {item.notificationTime ? (
                <Chip
                  mode="flat"
                  compact
                  style={[styles.timeChip, { backgroundColor: theme.colors.primaryContainer }]}
                  textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 12 }}
                >
                  {item.notificationTime}
                </Chip>
              ) : (
                <Chip
                  mode="flat"
                  compact
                  icon="alert"
                  style={[styles.timeChip, { backgroundColor: appTheme.custom.warningContainer }]}
                  textStyle={{ color: appTheme.custom.onWarningContainer, fontSize: 12 }}
                >
                  Upozornění
                </Chip>
              )}
            </View>

            {item.description && (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}

            {/* Days */}
            <View style={styles.daysRow}>
              {item.daysOfWeek.map(day => (
                <Text
                  key={day}
                  style={[
                    styles.dayBadge,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      color: theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {DAY_NAMES_SHORT[day]}
                </Text>
              ))}
            </View>
          </View>

          {/* Actions menu */}
          <Menu
            visible={menuVisible === item.id}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(item.id)}
              />
            }
          >
            <Menu.Item
              leadingIcon="pencil"
              onPress={() => {
                setMenuVisible(null);
                navigation.navigate('AdminTaskForm', { taskId: item.id });
              }}
              title={CzechText.editTask}
            />
            <Divider />
            <Menu.Item
              leadingIcon="delete"
              onPress={() => {
                setMenuVisible(null);
                handleDelete(item);
              }}
              title={CzechText.deleteTask}
              titleStyle={{ color: theme.colors.error }}
            />
          </Menu>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      {/* Day filter chips */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[null, 1, 2, 3, 4, 5, 6, 7] as (DayOfWeek | null)[]}
          keyExtractor={item => item?.toString() || 'all'}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <Chip
              mode={selectedDay === item ? 'flat' : 'outlined'}
              selected={selectedDay === item}
              onPress={() => setSelectedDay(item)}
              style={styles.filterChip}
            >
              {item === null ? 'Všechny' : DAY_NAMES[item]}
            </Chip>
          )}
        />
      </View>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {CzechText.noTasks}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContent}
        />
      )}

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
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    marginRight: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  taskCard: {
    marginBottom: 12,
  },
  taskContent: {
    paddingVertical: 8,
  },
  taskMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 8,
  },
  taskName: {
    flex: 1,
  },
  timeChip: {
    height: 24,
  },
  daysRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 4,
  },
  dayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 11,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
