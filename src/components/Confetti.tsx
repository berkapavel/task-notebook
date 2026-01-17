/**
 * Confetti - Celebration animation for task completion
 * Uses react-native-confetti-cannon for particle effects
 */

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ConfettiRef {
  fire: () => void;
}

interface ConfettiProps {
  onComplete?: () => void;
}

const Confetti = forwardRef<ConfettiRef, ConfettiProps>(({ onComplete }, ref) => {
  const confettiRef = useRef<ConfettiCannon | null>(null);

  useImperativeHandle(ref, () => ({
    fire: () => {
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    },
  }));

  // Child-friendly confetti colors
  const colors = [
    '#7C4DFF', // purple (primary)
    '#FF9800', // orange
    '#4CAF50', // green
    '#E91E63', // pink
    '#2196F3', // blue
    '#FFC107', // yellow
    '#00BCD4', // cyan
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT }}
        autoStart={false}
        fadeOut
        explosionSpeed={350}
        fallSpeed={3000}
        colors={colors}
        onAnimationEnd={onComplete}
      />
    </View>
  );
});

Confetti.displayName = 'Confetti';

export default Confetti;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
});
