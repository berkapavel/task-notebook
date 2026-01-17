/**
 * Task Form Component
 * Reusable form for adding and editing tasks
 */

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Switch,
  HelperText,
  useTheme,
  Divider,
} from 'react-native-paper';
import { Task, DayOfWeek } from '../types';
import { CzechText } from '../theme';
import DaySelector from './DaySelector';
import TimePicker from './TimePicker';
import { TaskTemplate } from './TaskTemplates';

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'isActive'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface TaskFormRef {
  setFromTemplate: (template: TaskTemplate) => void;
}

const TaskForm = forwardRef<TaskFormRef, TaskFormProps>(function TaskForm({
  initialTask,
  onSubmit,
  onCancel,
  isLoading = false,
}, ref) {
  const theme = useTheme();

  // Form state
  const [name, setName] = useState(initialTask?.name || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(
    initialTask?.daysOfWeek || [1] // Default to Monday
  );
  const [hasTime, setHasTime] = useState(!!initialTask?.notificationTime);
  const [notificationTime, setNotificationTime] = useState(
    initialTask?.notificationTime || '12:00'
  );
  const [canBeCompleted, setCanBeCompleted] = useState(
    initialTask?.canBeCompleted ?? false
  );

  // Validation
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Update form state when initialTask changes (for edit mode)
  useEffect(() => {
    if (initialTask) {
      setName(initialTask.name);
      setDescription(initialTask.description || '');
      setDaysOfWeek(initialTask.daysOfWeek);
      setHasTime(!!initialTask.notificationTime);
      setNotificationTime(initialTask.notificationTime || '12:00');
      setCanBeCompleted(initialTask.canBeCompleted ?? false);
    }
  }, [initialTask]);

  // Expose method to set form from template
  useImperativeHandle(ref, () => ({
    setFromTemplate: (template: TaskTemplate) => {
      setName(template.name);
      setDescription(template.description || '');
      setDaysOfWeek(template.suggestedDays);
      if (template.suggestedTime) {
        setHasTime(true);
        setNotificationTime(template.suggestedTime);
      } else {
        setHasTime(false);
        setCanBeCompleted(false);
      }
    },
  }));

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Název úkolu je povinný';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      daysOfWeek,
      notificationTime: hasTime ? notificationTime : undefined,
      canBeCompleted: !hasTime ? canBeCompleted : undefined,
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Task Name */}
      <TextInput
        label={CzechText.taskName}
        value={name}
        onChangeText={setName}
        style={styles.input}
        error={!!errors.name}
        disabled={isLoading}
      />
      {errors.name && (
        <HelperText type="error" visible={true}>
          {errors.name}
        </HelperText>
      )}

      {/* Description */}
      <TextInput
        label={CzechText.taskDescription}
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={3}
        disabled={isLoading}
      />

      <Divider style={styles.divider} />

      {/* Days Selection */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {CzechText.selectDays}
      </Text>
      <DaySelector
        selectedDays={daysOfWeek}
        onDaysChange={setDaysOfWeek}
        disabled={isLoading}
      />

      <Divider style={styles.divider} />

      {/* Time Toggle */}
      <View style={styles.timeToggleRow}>
        <View style={styles.timeToggleLabel}>
          <Text variant="titleMedium">{CzechText.notificationTime}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {hasTime
              ? 'Úkol bude mít čas splnění a upozornění'
              : 'Úkol bude zobrazen jako upozornění bez času'}
          </Text>
        </View>
        <Switch
          value={hasTime}
          onValueChange={setHasTime}
          disabled={isLoading}
        />
      </View>

      {/* Time Picker (only if hasTime) */}
      {hasTime && (
        <TimePicker
          value={notificationTime}
          onChange={setNotificationTime}
          disabled={isLoading}
        />
      )}

      {/* Can Be Completed option (only if no time - warning mode) */}
      {!hasTime && (
        <View style={styles.timeToggleRow}>
          <View style={styles.timeToggleLabel}>
            <Text variant="titleMedium">{CzechText.canBeCompletedLabel}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {CzechText.canBeCompletedDescription}
            </Text>
          </View>
          <Switch
            value={canBeCompleted}
            onValueChange={setCanBeCompleted}
            disabled={isLoading}
          />
        </View>
      )}

      <Divider style={styles.divider} />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          onPress={onCancel}
          disabled={isLoading}
          style={styles.button}
        >
          {CzechText.cancel}
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading || !name.trim()}
          style={styles.button}
        >
          {CzechText.save}
        </Button>
      </View>
    </ScrollView>
  );
});

export default TaskForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  timeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeToggleLabel: {
    flex: 1,
    marginRight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
