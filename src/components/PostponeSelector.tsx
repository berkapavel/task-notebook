/**
 * PostponeSelector Component
 * Allows selecting postpone time increments for tasks
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import { theme, CzechText } from '../theme';
import { getMaxPostponeMinutes, addMinutesToTime } from '../utils/dateUtils';

interface PostponeSelectorProps {
  currentTime: string;
  onSelect: (newTime: string) => void;
  onCancel: () => void;
}

const POSTPONE_OPTIONS = [10, 20, 30, 40, 50, 60];

export default function PostponeSelector({
  currentTime,
  onSelect,
  onCancel,
}: PostponeSelectorProps) {
  const maxMinutes = useMemo(
    () => getMaxPostponeMinutes(currentTime),
    [currentTime]
  );

  const availableOptions = useMemo(() => {
    return POSTPONE_OPTIONS.filter(minutes => minutes <= maxMinutes);
  }, [maxMinutes]);

  const handleSelect = (minutes: number) => {
    const newTime = addMinutesToTime(currentTime, minutes);
    if (newTime) {
      onSelect(newTime);
    }
  };

  const hasLimitedOptions = maxMinutes < 60;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{CzechText.postponeBy}</Text>
        <Text style={styles.currentTime}>
          Aktuální čas: {currentTime}
        </Text>
      </View>

      {availableOptions.length > 0 ? (
        <>
          <View style={styles.optionsContainer}>
            {availableOptions.map(minutes => (
              <Chip
                key={minutes}
                mode="outlined"
                style={styles.optionChip}
                textStyle={styles.optionText}
                onPress={() => handleSelect(minutes)}
              >
                +{minutes} {CzechText.minutes}
              </Chip>
            ))}
          </View>

          {hasLimitedOptions && (
            <Text style={styles.warningText}>
              {CzechText.cannotPostpone}
            </Text>
          )}
        </>
      ) : (
        <View style={styles.noOptionsContainer}>
          <Text style={styles.noOptionsText}>
            {CzechText.cannotPostpone}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.cancelButton}
        >
          {CzechText.cancel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  currentTime: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionChip: {
    marginBottom: 4,
  },
  optionText: {
    fontSize: 14,
  },
  warningText: {
    fontSize: 12,
    color: theme.custom.warning,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  noOptionsContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noOptionsText: {
    fontSize: 14,
    color: theme.colors.error,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  cancelButton: {
    minWidth: 100,
  },
});
