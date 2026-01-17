/**
 * NotificationPermissionBanner
 * Shows warnings when notification permissions are missing
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme, CzechText } from '../theme';
import * as NotificationService from '../services/NotificationService';

type PermissionType = 'notification' | 'exactAlarm' | 'battery';

interface PermissionWarning {
  type: PermissionType;
  title: string;
  message: string;
  icon: string;
  onOpenSettings: () => void;
}

export default function NotificationPermissionBanner() {
  const [warnings, setWarnings] = useState<PermissionWarning[]>([]);
  const [dismissedTypes, setDismissedTypes] = useState<Set<PermissionType>>(new Set());

  const checkPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    const newWarnings: PermissionWarning[] = [];

    // Check notification permission
    const hasNotificationPermission = await NotificationService.requestPermissions();
    if (!hasNotificationPermission) {
      newWarnings.push({
        type: 'notification',
        title: CzechText.notificationPermissionTitle,
        message: CzechText.notificationPermissionMessage,
        icon: 'bell-off',
        onOpenSettings: () => {
          // Opens app notification settings
          NotificationService.requestPermissions();
        },
      });
    }

    // Check exact alarm permission
    const hasExactAlarmPermission = await NotificationService.checkExactAlarmPermission();
    if (!hasExactAlarmPermission) {
      newWarnings.push({
        type: 'exactAlarm',
        title: CzechText.exactAlarmPermissionTitle,
        message: CzechText.exactAlarmPermissionMessage,
        icon: 'alarm-off',
        onOpenSettings: () => NotificationService.openExactAlarmSettings(),
      });
    }

    // Check battery optimization
    const hasBatteryOptDisabled = await NotificationService.checkBatteryOptimization();
    if (!hasBatteryOptDisabled) {
      newWarnings.push({
        type: 'battery',
        title: CzechText.batteryOptimizationTitle,
        message: CzechText.batteryOptimizationMessage,
        icon: 'battery-alert',
        onOpenSettings: () => NotificationService.openBatteryOptimizationSettings(),
      });
    }

    setWarnings(newWarnings);
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const handleDismiss = (type: PermissionType) => {
    setDismissedTypes(prev => new Set(prev).add(type));
  };

  const handleOpenSettings = async (warning: PermissionWarning) => {
    await warning.onOpenSettings();
    // Re-check permissions after returning from settings
    setTimeout(() => {
      checkPermissions();
    }, 1000);
  };

  // Filter out dismissed warnings
  const activeWarnings = warnings.filter(w => !dismissedTypes.has(w.type));

  if (activeWarnings.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {activeWarnings.map(warning => (
        <View key={warning.type} style={styles.banner}>
          <View style={styles.iconContainer}>
            <Icon name={warning.icon} size={24} color={theme.custom.onWarningContainer} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{warning.title}</Text>
            <Text style={styles.message}>{warning.message}</Text>
            <View style={styles.actions}>
              <Button
                mode="contained"
                compact
                onPress={() => handleOpenSettings(warning)}
                style={styles.settingsButton}
                labelStyle={styles.buttonLabel}
              >
                {CzechText.openSettings}
              </Button>
              <Button
                mode="text"
                compact
                onPress={() => handleDismiss(warning.type)}
                labelStyle={styles.dismissLabel}
              >
                {CzechText.permissionDismiss}
              </Button>
            </View>
          </View>
          <IconButton
            icon="close"
            size={20}
            onPress={() => handleDismiss(warning.type)}
            style={styles.closeButton}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: theme.custom.warningContainer,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.custom.warning,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.custom.onWarningContainer,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: theme.custom.onWarningContainer,
    opacity: 0.9,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    backgroundColor: theme.custom.warning,
  },
  buttonLabel: {
    fontSize: 12,
    color: theme.custom.onWarning,
  },
  dismissLabel: {
    fontSize: 12,
    color: theme.custom.onWarningContainer,
  },
  closeButton: {
    margin: -8,
  },
});
