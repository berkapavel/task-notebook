/**
 * TaskTemplates - Quick task templates for common children's tasks
 * One-tap add from predefined templates
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, Portal, Modal, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme, CzechText } from '../theme';
import { DayOfWeek } from '../types';

export interface TaskTemplate {
  name: string;
  description?: string;
  icon: string;
  suggestedTime?: string;
  suggestedDays: DayOfWeek[];
  category: 'morning' | 'afterschool' | 'evening' | 'weekend';
}

// Predefined task templates
export const TASK_TEMPLATES: TaskTemplate[] = [
  // Morning routine
  {
    name: 'Vyčistit si zuby',
    description: 'Ranní čištění zubů',
    icon: 'toothbrush',
    suggestedTime: '07:00',
    suggestedDays: [1, 2, 3, 4, 5, 6, 7],
    category: 'morning',
  },
  {
    name: 'Ustlat postel',
    description: 'Urovnat povlečení a polštáře',
    icon: 'bed',
    suggestedTime: '07:30',
    suggestedDays: [1, 2, 3, 4, 5, 6, 7],
    category: 'morning',
  },
  {
    name: 'Obléknout se',
    description: 'Připravit si oblečení na den',
    icon: 'tshirt-crew',
    suggestedTime: '07:15',
    suggestedDays: [1, 2, 3, 4, 5, 6, 7],
    category: 'morning',
  },
  {
    name: 'Nasnídat se',
    description: 'Zdravá snídaně',
    icon: 'food-apple',
    suggestedTime: '07:30',
    suggestedDays: [1, 2, 3, 4, 5, 6, 7],
    category: 'morning',
  },

  // After school
  {
    name: 'Udělat domácí úkoly',
    description: 'Školní práce a učení',
    icon: 'notebook',
    suggestedTime: '15:00',
    suggestedDays: [1, 2, 3, 4, 5],
    category: 'afterschool',
  },
  {
    name: 'Připravit si věci do školy',
    description: 'Aktovka, sešity, pomůcky',
    icon: 'bag-personal',
    suggestedTime: '18:00',
    suggestedDays: [1, 2, 3, 4, 7],
    category: 'afterschool',
  },
  {
    name: 'Přečíst si knihu',
    description: '15 minut čtení',
    icon: 'book-open-page-variant',
    suggestedTime: '16:00',
    suggestedDays: [1, 2, 3, 4, 5],
    category: 'afterschool',
  },
  {
    name: 'Cvičit na hudební nástroj',
    description: 'Denní cvičení',
    icon: 'music',
    suggestedTime: '17:00',
    suggestedDays: [1, 2, 3, 4, 5],
    category: 'afterschool',
  },

  // Evening routine
  {
    name: 'Večerní hygiena',
    description: 'Zuby, umýt se, pyžamo',
    icon: 'shower',
    suggestedTime: '19:30',
    suggestedDays: [1, 2, 3, 4, 5, 6, 7],
    category: 'evening',
  },
  {
    name: 'Uklidit hračky',
    description: 'Vrátit hračky na místo',
    icon: 'toy-brick',
    suggestedTime: '18:30',
    suggestedDays: [1, 2, 3, 4, 5, 6, 7],
    category: 'evening',
  },

  // Weekend chores
  {
    name: 'Uklidit pokoj',
    description: 'Pořádek v pokoji',
    icon: 'broom',
    suggestedTime: '10:00',
    suggestedDays: [6, 7],
    category: 'weekend',
  },
  {
    name: 'Pomoci s domácností',
    description: 'Vysávání, utírání prachu',
    icon: 'home-heart',
    suggestedTime: '10:00',
    suggestedDays: [6],
    category: 'weekend',
  },
  {
    name: 'Venčit pejska',
    description: 'Procházka se psem',
    icon: 'dog-side',
    suggestedTime: '09:00',
    suggestedDays: [6, 7],
    category: 'weekend',
  },
];

const CATEGORY_LABELS: Record<TaskTemplate['category'], string> = {
  morning: 'Ranní rutina',
  afterschool: 'Po škole',
  evening: 'Večerní rutina',
  weekend: 'Víkend',
};

const CATEGORY_ICONS: Record<TaskTemplate['category'], string> = {
  morning: 'weather-sunset-up',
  afterschool: 'school',
  evening: 'weather-night',
  weekend: 'calendar-weekend',
};

interface TaskTemplatesProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (template: TaskTemplate) => void;
}

export default function TaskTemplates({
  visible,
  onDismiss,
  onSelect,
}: TaskTemplatesProps) {
  const categories: TaskTemplate['category'][] = ['morning', 'afterschool', 'evening', 'weekend'];

  const getTemplatesByCategory = (category: TaskTemplate['category']) =>
    TASK_TEMPLATES.filter(t => t.category === category);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <View style={styles.header}>
          <Icon name="lightning-bolt" size={28} color={theme.colors.primary} />
          <Text style={styles.title}>Rychlé šablony</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {categories.map(category => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Icon
                  name={CATEGORY_ICONS[category]}
                  size={20}
                  color={theme.colors.secondary}
                />
                <Text style={styles.categoryTitle}>{CATEGORY_LABELS[category]}</Text>
              </View>
              <View style={styles.templatesList}>
                {getTemplatesByCategory(category).map((template, index) => (
                  <Chip
                    key={`${category}-${index}`}
                    icon={() => (
                      <Icon
                        name={template.icon}
                        size={18}
                        color={theme.colors.primary}
                      />
                    )}
                    onPress={() => {
                      onSelect(template);
                      onDismiss();
                    }}
                    style={styles.templateChip}
                    textStyle={styles.templateChipText}
                  >
                    {template.name}
                  </Chip>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        <Button
          mode="outlined"
          onPress={onDismiss}
          style={styles.closeButton}
        >
          {CzechText.cancel}
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: theme.colors.surface,
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  scrollView: {
    maxHeight: 400,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
    textTransform: 'uppercase',
  },
  templatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateChip: {
    backgroundColor: theme.colors.primaryContainer,
  },
  templateChipText: {
    fontSize: 13,
  },
  closeButton: {
    marginTop: 16,
  },
});
