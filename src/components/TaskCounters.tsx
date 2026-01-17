/**
 * TaskCounters Component
 * Shows incomplete and completed task counts side by side
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { theme, CzechText } from '../theme';

interface TaskCountersProps {
  incomplete: number;
  completed: number;
}

export default function TaskCounters({ incomplete, completed }: TaskCountersProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.counterBox, styles.incompleteBox]}>
        <Text style={styles.countText}>{incomplete}</Text>
        <Text style={styles.labelText}>{CzechText.incomplete}</Text>
      </View>
      <View style={[styles.counterBox, styles.completedBox]}>
        <Text style={styles.countText}>{completed}</Text>
        <Text style={styles.labelText}>{CzechText.completed}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  counterBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  incompleteBox: {
    backgroundColor: theme.colors.errorContainer,
  },
  completedBox: {
    backgroundColor: theme.custom.successContainer,
  },
  countText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  labelText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
});
