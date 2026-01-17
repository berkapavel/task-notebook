/**
 * ProgressBar - Animated daily progress indicator
 * Shows task completion progress with color gradient
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../theme';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage, animatedWidth]);

  // Color gradient based on progress: red → orange → yellow → green
  const getProgressColor = (pct: number): string => {
    if (pct >= 100) return theme.custom.success;
    if (pct >= 75) return '#8BC34A'; // light green
    if (pct >= 50) return '#FFC107'; // yellow
    if (pct >= 25) return '#FF9800'; // orange
    return '#E57373'; // light red
  };

  const progressColor = getProgressColor(percentage);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (total === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>Dnešní pokrok</Text>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
      </View>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: widthInterpolated,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>
      <Text style={styles.countText}>
        {completed} z {total} splněno
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  progressBackground: {
    height: 12,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  countText: {
    fontSize: 12,
    color: theme.colors.outline,
    marginTop: 6,
    textAlign: 'center',
  },
});
