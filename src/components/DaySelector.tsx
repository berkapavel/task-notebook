/**
 * Day Selector Component
 * Allows selecting one or more days of the week (Monday-Sunday)
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { DayOfWeek, DAY_NAMES_SHORT } from '../types';

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onDaysChange: (days: DayOfWeek[]) => void;
  disabled?: boolean;
}

const ALL_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];
const WORKDAYS: DayOfWeek[] = [1, 2, 3, 4, 5];
const WEEKEND: DayOfWeek[] = [6, 7];

export default function DaySelector({
  selectedDays,
  onDaysChange,
  disabled = false,
}: DaySelectorProps) {
  const theme = useTheme();

  const toggleDay = (day: DayOfWeek) => {
    if (disabled) return;

    if (selectedDays.includes(day)) {
      // Remove day (but keep at least one)
      if (selectedDays.length > 1) {
        onDaysChange(selectedDays.filter(d => d !== day));
      }
    } else {
      // Add day
      onDaysChange([...selectedDays, day].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onDaysChange(ALL_DAYS);
  };

  const selectWorkdays = () => {
    if (disabled) return;
    onDaysChange(WORKDAYS);
  };

  const selectWeekend = () => {
    if (disabled) return;
    onDaysChange(WEEKEND);
  };

  const isAllSelected = selectedDays.length === 7;
  const isWorkdaysSelected = selectedDays.length === 5 && WORKDAYS.every(d => selectedDays.includes(d));
  const isWeekendSelected = selectedDays.length === 2 && WEEKEND.every(d => selectedDays.includes(d));

  return (
    <View style={styles.container}>
      <View style={styles.daysRow}>
        {ALL_DAYS.map(day => {
          const isSelected = selectedDays.includes(day);
          return (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              disabled={disabled}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.surfaceVariant,
                  opacity: disabled ? 0.5 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isSelected
                      ? theme.colors.onPrimary
                      : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {DAY_NAMES_SHORT[day]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.quickSelectRow}>
        <Pressable
          onPress={selectAll}
          disabled={disabled || isAllSelected}
          style={[
            styles.quickSelectButton,
            {
              opacity: disabled || isAllSelected ? 0.5 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.quickSelectText,
              { color: theme.colors.primary },
            ]}
          >
            Všechny dny
          </Text>
        </Pressable>

        <Pressable
          onPress={selectWorkdays}
          disabled={disabled || isWorkdaysSelected}
          style={[
            styles.quickSelectButton,
            {
              opacity: disabled || isWorkdaysSelected ? 0.5 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.quickSelectText,
              { color: theme.colors.primary },
            ]}
          >
            Pracovní dny
          </Text>
        </Pressable>

        <Pressable
          onPress={selectWeekend}
          disabled={disabled || isWeekendSelected}
          style={[
            styles.quickSelectButton,
            {
              opacity: disabled || isWeekendSelected ? 0.5 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.quickSelectText,
              { color: theme.colors.primary },
            ]}
          >
            Víkend
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  quickSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  quickSelectButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quickSelectText: {
    fontSize: 14,
  },
});
