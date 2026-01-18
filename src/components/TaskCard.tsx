/**
 * TaskCard Component
 * Displays a single task with checkbox for completion
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Checkbox, Portal, Dialog, Button, Chip } from 'react-native-paper';
import { TaskWithState } from '../types';
import { theme, CzechText } from '../theme';
import { formatTime } from '../utils/dateUtils';

interface TaskCardProps {
  task: TaskWithState;
  onComplete: (taskId: string) => void;
  onPress: (taskId: string) => void;
}

export default function TaskCard({ task, onComplete, onPress }: TaskCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const currentTime = task.dailyState?.currentTime || task.notificationTime || '';
  const postponeCount = task.dailyState?.postponeCount || 0;

  const handleCheckboxPress = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmComplete = () => {
    setShowConfirmDialog(false);
    onComplete(task.id);
  };

  const handleCancelComplete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Card style={styles.card} onPress={() => onPress(task.id)}>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={handleCheckboxPress}
            style={styles.checkboxContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Checkbox.Android
              status="unchecked"
              color={theme.custom.success}
            />
          </TouchableOpacity>

          <View style={styles.textContent}>
            <Text style={styles.name}>{task.name}</Text>
            {task.description && (
              <Text style={styles.description} numberOfLines={2}>
                {task.description}
              </Text>
            )}
            {postponeCount > 0 && (
              <Text style={styles.postponeInfo}>
                Odloženo {postponeCount}×
              </Text>
            )}
          </View>

          <View style={styles.timeContainer}>
            <Chip
              mode="flat"
              style={styles.timeChip}
              textStyle={styles.timeChipText}
            >
              {formatTime(currentTime)}
            </Chip>
          </View>
        </View>
      </Card>

      <Portal>
        <Dialog visible={showConfirmDialog} onDismiss={handleCancelComplete}>
          <Dialog.Title>{CzechText.completeTask}</Dialog.Title>
          <Dialog.Content>
            <Text>{CzechText.confirmComplete}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancelComplete}>{CzechText.no}</Button>
            <Button mode="contained" onPress={handleConfirmComplete}>
              {CzechText.yes}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  checkboxContainer: {
    marginRight: 8,
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  description: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  postponeInfo: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 4,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  timeChipText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onPrimaryContainer,
  },
});
