/**
 * Date utility functions
 */

import { format, parse, isToday, isTomorrow, isYesterday, addDays, getDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DayOfWeek, DAY_NAMES, DAY_NAMES_SHORT } from '../types';
import { CzechText } from '../theme';

/**
 * Format a date string (YYYY-MM-DD) for display
 */
export function formatDate(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());

  if (isToday(date)) {
    return CzechText.today;
  }
  if (isTomorrow(date)) {
    return CzechText.tomorrow;
  }
  if (isYesterday(date)) {
    return CzechText.yesterday;
  }

  return format(date, 'd. MMMM', { locale: cs });
}

/**
 * Format a date string with day name
 */
export function formatDateWithDay(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'EEEE, d. MMMM', { locale: cs });
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Get a date offset from today as YYYY-MM-DD string
 */
export function getDateString(offset: number = 0): string {
  return format(addDays(new Date(), offset), 'yyyy-MM-dd');
}

/**
 * Get the day of week (1-7, Monday = 1) from a date string
 */
export function getDayOfWeek(dateStr: string): DayOfWeek {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  const jsDay = getDay(date); // 0 = Sunday, 1 = Monday, etc.
  // Convert to our format: 1 = Monday, 7 = Sunday
  return (jsDay === 0 ? 7 : jsDay) as DayOfWeek;
}

/**
 * Get day name from day number
 */
export function getDayName(day: DayOfWeek): string {
  return DAY_NAMES[day];
}

/**
 * Get short day name from day number
 */
export function getDayNameShort(day: DayOfWeek): string {
  return DAY_NAMES_SHORT[day];
}

/**
 * Format time string for display (HH:mm -> HH:mm)
 */
export function formatTime(time: string): string {
  return time; // Already in HH:mm format
}

/**
 * Parse time string to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Add minutes to a time string, returns null if result would be next day
 */
export function addMinutesToTime(time: string, minutesToAdd: number): string | null {
  const totalMinutes = timeToMinutes(time) + minutesToAdd;

  // Check if we'd go past midnight (1440 minutes = 24 hours)
  if (totalMinutes >= 1440) {
    return null;
  }

  return minutesToTime(totalMinutes);
}

/**
 * Calculate maximum postpone minutes that keep time within same day
 * Returns maximum minutes that can be added (rounded to 10 min increments)
 */
export function getMaxPostponeMinutes(time: string): number {
  const currentMinutes = timeToMinutes(time);
  const remaining = 1439 - currentMinutes; // 1439 = 23:59
  return Math.floor(remaining / 10) * 10; // Round down to 10 min increment
}

/**
 * Check if a date is before or equal to another date (date strings)
 */
export function isDateOnOrBefore(dateStr: string, referenceStr: string): boolean {
  return dateStr <= referenceStr;
}

/**
 * Check if a task should appear on a given date
 * Task appears if:
 * - The task was created on or before this date
 * - The day of week matches the task's daysOfWeek
 */
export function shouldTaskAppearOnDate(
  taskCreatedAt: string,
  taskDaysOfWeek: DayOfWeek[],
  targetDate: string
): boolean {
  // Check if task was created on or before target date
  if (taskCreatedAt > targetDate) {
    return false;
  }

  // Check if the day of week matches
  const dayOfWeek = getDayOfWeek(targetDate);
  return taskDaysOfWeek.includes(dayOfWeek);
}
