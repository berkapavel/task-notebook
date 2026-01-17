/**
 * TaskDetailScreen - Detailed view of a task with postpone capability
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Portal, Dialog, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList, TaskWithState } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { theme, CzechText } from '../../theme';
import { formatTime } from '../../utils/dateUtils';
import PostponeSelector from '../../components/PostponeSelector';

type TaskDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen({ route, navigation }: TaskDetailScreenProps) {
  const { taskId, date } = route.params;
  const { getDailyTasks, completeTask, postponeTask } = useTasks();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPostponeSelector, setShowPostponeSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Find the task with its daily state
  const task: TaskWithState | undefined = useMemo(() => {
    const dailyTasks = getDailyTasks(date);
    return dailyTasks.find(t => t.id === taskId);
  }, [getDailyTasks, date, taskId]);

  if (!task) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.notFoundContainer}>
          <Icon name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={styles.notFoundText}>Úkol nenalezen</Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Zpět
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const currentTime = task.dailyState?.currentTime || task.notificationTime || '';
  const originalTime = task.notificationTime || '';
  const postponeCount = task.dailyState?.postponeCount || 0;
  const remainingPostpones = 2 - postponeCount;
  const canPostpone = remainingPostpones > 0 && !task.dailyState?.completed;
  const isCompleted = task.dailyState?.completed || false;
  const wasPostponed = currentTime !== originalTime;

  const handleConfirmComplete = async () => {
    setShowConfirmDialog(false);
    setIsProcessing(true);
    try {
      await completeTask(taskId, date);
      navigation.goBack();
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePostponeSelect = async (newTime: string) => {
    setShowPostponeSelector(false);
    setIsProcessing(true);
    try {
      const success = await postponeTask(taskId, date, newTime);
      if (!success) {
        // Max postpones reached - shouldn't happen due to UI guard
        console.warn('Postpone failed - max reached');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Task Name */}
        <View style={styles.headerSection}>
          <Text style={styles.taskName}>{task.name}</Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Icon name="check-circle" size={20} color={theme.custom.success} />
              <Text style={styles.completedText}>Splněno</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {task.description && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionLabel}>Popis</Text>
              <Text style={styles.description}>{task.description}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Time Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionLabel}>Čas</Text>

            <View style={styles.timeRow}>
              <Icon name="clock-outline" size={24} color={theme.colors.primary} />
              <View style={styles.timeInfo}>
                <Text style={styles.currentTimeLabel}>
                  {wasPostponed ? 'Aktuální čas:' : 'Naplánováno na:'}
                </Text>
                <Text style={styles.currentTimeValue}>{formatTime(currentTime)}</Text>
              </View>
            </View>

            {wasPostponed && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.timeRow}>
                  <Icon name="clock-check-outline" size={24} color={theme.colors.outline} />
                  <View style={styles.timeInfo}>
                    <Text style={styles.originalTimeLabel}>Původní čas:</Text>
                    <Text style={styles.originalTimeValue}>{formatTime(originalTime)}</Text>
                  </View>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Postpone Information */}
        {!isCompleted && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.postponeInfoRow}>
                <Icon name="clock-fast" size={24} color={theme.colors.secondary} />
                <View style={styles.postponeTextContainer}>
                  <Text style={styles.postponeLabel}>{CzechText.postponeRemaining}</Text>
                  <Text style={[
                    styles.postponeValue,
                    remainingPostpones === 0 && styles.postponeValueZero
                  ]}>
                    {remainingPostpones}
                  </Text>
                </View>
              </View>

              {postponeCount > 0 && (
                <Text style={styles.postponeHistory}>
                  Úkol byl odložen {postponeCount}×
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Postpone Selector (expandable) */}
        {showPostponeSelector && canPostpone && (
          <Card style={styles.card}>
            <PostponeSelector
              currentTime={currentTime}
              onSelect={handlePostponeSelect}
              onCancel={() => setShowPostponeSelector(false)}
            />
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {!isCompleted && (
        <View style={styles.actionsContainer}>
          {canPostpone && !showPostponeSelector && (
            <Button
              mode="outlined"
              icon="clock-plus-outline"
              onPress={() => setShowPostponeSelector(true)}
              style={styles.actionButton}
              disabled={isProcessing}
            >
              {CzechText.postpone}
            </Button>
          )}

          <Button
            mode="contained"
            icon="check-circle-outline"
            onPress={() => setShowConfirmDialog(true)}
            style={styles.actionButton}
            loading={isProcessing}
            disabled={isProcessing}
          >
            {CzechText.completeTask}
          </Button>
        </View>
      )}

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={showConfirmDialog} onDismiss={() => setShowConfirmDialog(false)}>
          <Dialog.Title>{CzechText.completeTask}</Dialog.Title>
          <Dialog.Content>
            <Text>{CzechText.confirmComplete}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirmDialog(false)}>{CzechText.no}</Button>
            <Button mode="contained" onPress={handleConfirmComplete}>
              {CzechText.yes}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    paddingBottom: 120,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    color: theme.colors.error,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    minWidth: 120,
  },
  headerSection: {
    padding: 16,
    paddingTop: 24,
  },
  taskName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.custom.successContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.custom.onSuccessContainer,
    marginLeft: 6,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: theme.colors.onSurface,
    lineHeight: 24,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  currentTimeLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  currentTimeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  divider: {
    marginVertical: 12,
  },
  originalTimeLabel: {
    fontSize: 12,
    color: theme.colors.outline,
  },
  originalTimeValue: {
    fontSize: 18,
    color: theme.colors.outline,
    textDecorationLine: 'line-through',
  },
  postponeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postponeTextContainer: {
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  postponeLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginRight: 8,
  },
  postponeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  postponeValueZero: {
    color: theme.colors.error,
  },
  postponeHistory: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
