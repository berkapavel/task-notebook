/**
 * AchievementBadge - Visual badge component for achievements
 * Shows locked/unlocked states with optional animation
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Achievement } from '../types';
import { theme } from '../theme';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

export default function AchievementBadge({
  achievement,
  size = 'medium',
  animate = false,
}: AchievementBadgeProps) {
  const scaleAnim = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const isUnlocked = !!achievement.unlockedAt;

  useEffect(() => {
    if (animate && isUnlocked) {
      // Pop animation on unlock
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Subtle rotation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [animate, isUnlocked, scaleAnim, rotateAnim]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { container: 60, icon: 24, fontSize: 10 };
      case 'large':
        return { container: 100, icon: 48, fontSize: 14 };
      default:
        return { container: 80, icon: 36, fontSize: 12 };
    }
  };

  const sizeStyles = getSizeStyles();

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          {
            width: sizeStyles.container,
            height: sizeStyles.container,
            backgroundColor: isUnlocked
              ? theme.colors.primaryContainer
              : theme.colors.surfaceVariant,
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        <Icon
          name={isUnlocked ? achievement.icon : 'lock'}
          size={sizeStyles.icon}
          color={isUnlocked ? theme.colors.primary : theme.colors.outline}
        />
      </Animated.View>
      <Text
        style={[
          styles.name,
          {
            fontSize: sizeStyles.fontSize,
            color: isUnlocked ? theme.colors.onSurface : theme.colors.outline,
          },
        ]}
        numberOfLines={2}
      >
        {achievement.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    margin: 8,
    width: 90,
  },
  container: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  name: {
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
});
