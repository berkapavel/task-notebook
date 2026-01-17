/**
 * WarningAlertsSection Component
 * Displays tasks without notification time as warnings/reminders
 * Supports completable warnings (canBeCompleted = true)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TaskWithState } from '../types';
import { theme, CzechText, commonStyles } from '../theme';

interface WarningAlertsSectionProps {
  tasks: TaskWithState[];
  onComplete?: (taskId: string) => void;
}

export default function WarningAlertsSection({ tasks, onComplete }: WarningAlertsSectionProps) {
  // Only show tasks without notification time (warnings)
  const warningTasks = tasks.filter(task => !task.notificationTime);

  if (warningTasks.length === 0) {
    return null;
  }

  // Separate completable and non-completable warnings
  const completableWarnings = warningTasks.filter(task => task.canBeCompleted && !task.dailyState?.completed);
  const nonCompletableWarnings = warningTasks.filter(task => !task.canBeCompleted);

  // Don't show section if all are completed
  if (completableWarnings.length === 0 && nonCompletableWarnings.length === 0) {
    return null;
  }

  return (
    <View style={[commonStyles.warningBox, styles.container]}>
      <View style={styles.header}>
        <Icon name="alert-circle" size={24} color={theme.custom.onWarningContainer} />
        <Text style={styles.title}>{CzechText.warningsTitle}</Text>
      </View>
      <View style={styles.list}>
        {/* Non-completable warnings (info only) */}
        {nonCompletableWarnings.map(task => (
          <View key={task.id} style={styles.item}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{task.name}</Text>
              {task.description && (
                <Text style={styles.itemDescription}>{task.description}</Text>
              )}
            </View>
          </View>
        ))}
        {/* Completable warnings (with checkbox) */}
        {completableWarnings.map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.completableItem}
            onPress={() => onComplete?.(task.id)}
            activeOpacity={0.7}
          >
            <Checkbox
              status="unchecked"
              onPress={() => onComplete?.(task.id)}
              color={theme.custom.onWarningContainer}
              uncheckedColor={theme.custom.onWarningContainer}
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{task.name}</Text>
              {task.description && (
                <Text style={styles.itemDescription}>{task.description}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.custom.onWarningContainer,
    marginLeft: 8,
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  completableItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: -8,
  },
  bullet: {
    fontSize: 16,
    color: theme.custom.onWarningContainer,
    marginRight: 8,
    lineHeight: 22,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: theme.custom.onWarningContainer,
    lineHeight: 22,
  },
  itemDescription: {
    fontSize: 14,
    color: theme.custom.onWarningContainer,
    opacity: 0.8,
    marginTop: 2,
  },
});
