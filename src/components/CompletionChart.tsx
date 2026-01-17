/**
 * CompletionChart - Displays task completion as a pie chart
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { theme, CzechText } from '../theme';

interface CompletionChartProps {
  completed: number;
  incomplete: number;
}

const screenWidth = Dimensions.get('window').width;

export default function CompletionChart({ completed, incomplete }: CompletionChartProps) {
  const total = completed + incomplete;

  if (total === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{CzechText.noData}</Text>
      </View>
    );
  }

  const data = [
    {
      name: CzechText.completed,
      count: completed,
      color: theme.custom.success,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 14,
    },
    {
      name: CzechText.incomplete,
      count: incomplete,
      color: theme.colors.error,
      legendFontColor: theme.colors.onSurface,
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(124, 77, 255, ${opacity})`,
    labelColor: () => theme.colors.onSurface,
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        width={screenWidth - 32}
        height={180}
        chartConfig={chartConfig}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.outline,
  },
});
