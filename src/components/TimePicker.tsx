/**
 * Time Picker Component
 * Allows selecting time in 5-minute intervals using a simple picker UI
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import { Text, Button, useTheme, Surface, IconButton } from 'react-native-paper';

interface TimePickerProps {
  value: string; // "HH:mm" format
  onChange: (time: string) => void;
  disabled?: boolean;
}

// Generate time options in 5-minute intervals
function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      options.push(`${h}:${m}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

export default function TimePicker({
  value,
  onChange,
  disabled = false,
}: TimePickerProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (time: string) => {
    onChange(time);
    setModalVisible(false);
  };

  // Quick adjust buttons
  const adjustTime = (minutes: number) => {
    const [h, m] = value.split(':').map(Number);
    let totalMinutes = h * 60 + m + minutes;

    // Clamp to valid range
    if (totalMinutes < 0) totalMinutes = 0;
    if (totalMinutes >= 24 * 60) totalMinutes = 23 * 60 + 55;

    // Round to nearest 5 minutes
    totalMinutes = Math.round(totalMinutes / 5) * 5;

    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    onChange(`${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerRow}>
        <IconButton
          icon="minus"
          mode="outlined"
          size={20}
          onPress={() => adjustTime(-5)}
          disabled={disabled}
        />

        <Pressable
          onPress={() => !disabled && setModalVisible(true)}
          style={[
            styles.timeDisplay,
            {
              backgroundColor: theme.colors.surfaceVariant,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            {value}
          </Text>
        </Pressable>

        <IconButton
          icon="plus"
          mode="outlined"
          size={20}
          onPress={() => adjustTime(5)}
          disabled={disabled}
        />
      </View>

      {/* Quick select buttons */}
      <View style={styles.quickSelectRow}>
        {['07:00', '12:00', '17:00', '20:00'].map(time => (
          <Pressable
            key={time}
            onPress={() => !disabled && onChange(time)}
            style={[
              styles.quickButton,
              {
                backgroundColor: value === time
                  ? theme.colors.primaryContainer
                  : theme.colors.surface,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Text
              style={{
                color: value === time
                  ? theme.colors.onPrimaryContainer
                  : theme.colors.onSurface,
                fontSize: 13,
              }}
            >
              {time}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Full time picker modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Surface style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text variant="titleLarge" style={styles.modalTitle}>
              Vyberte čas
            </Text>

            <FlatList
              data={TIME_OPTIONS}
              keyExtractor={item => item}
              numColumns={4}
              style={styles.timeList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  style={[
                    styles.timeOption,
                    {
                      backgroundColor: item === value
                        ? theme.colors.primaryContainer
                        : theme.colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: item === value
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurface,
                      fontWeight: item === value ? '600' : '400',
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />

            <Button
              mode="text"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              Zavřít
            </Button>
          </Surface>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  quickSelectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  quickButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 16,
    padding: 16,
    elevation: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  timeList: {
    maxHeight: 400,
  },
  timeOption: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 8,
  },
});
