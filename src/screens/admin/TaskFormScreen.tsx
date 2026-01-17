/**
 * Task Form Screen (Admin)
 * Add or edit a task
 */

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import { useTasks } from '../../context/TaskContext';
import { RootStackParamList, Task } from '../../types';
import TaskForm, { TaskFormRef } from '../../components/TaskForm';
import TaskTemplates, { TaskTemplate } from '../../components/TaskTemplates';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminTaskForm'>;
  route: RouteProp<RootStackParamList, 'AdminTaskForm'>;
};

export default function TaskFormScreen({ navigation, route }: Props) {
  const paperTheme = useTheme();
  const { tasks, addTask, updateTask } = useTasks();
  const formRef = useRef<TaskFormRef>(null);

  const taskId = route.params?.taskId;
  const isEditing = !!taskId;

  const [existingTask, setExistingTask] = useState<Task | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Load existing task if editing
  useEffect(() => {
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      setExistingTask(task);
    }
  }, [taskId, tasks]);

  // Update header title
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Upravit úkol' : 'Nový úkol',
    });
  }, [navigation, isEditing]);

  const handleSubmit = async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'isActive'>
  ) => {
    setIsLoading(true);

    try {
      if (isEditing && existingTask) {
        // Update existing task
        await updateTask({
          ...existingTask,
          ...taskData,
        });
      } else {
        // Add new task
        await addTask(taskData);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Chyba',
        'Nepodařilo se uložit úkol. Zkuste to znovu.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleTemplateSelect = (template: TaskTemplate) => {
    formRef.current?.setFromTemplate(template);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
      edges={['bottom']}
    >
      <TaskForm
        ref={formRef}
        initialTask={existingTask}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />

      {/* Templates FAB - only show for new tasks */}
      {!isEditing && (
        <FAB
          icon="lightning-bolt"
          style={styles.fab}
          onPress={() => setShowTemplates(true)}
          label="Šablony"
        />
      )}

      {/* Templates modal */}
      <TaskTemplates
        visible={showTemplates}
        onDismiss={() => setShowTemplates(false)}
        onSelect={handleTemplateSelect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
  },
});
