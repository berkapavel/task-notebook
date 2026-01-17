/**
 * Achievement Service
 * Manages achievement unlocking, storage, and checking
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, AchievementId, StorageKeys, DailyTaskState } from '../types';

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS: Record<AchievementId, Omit<Achievement, 'unlockedAt'>> = {
  first_task: {
    id: 'first_task',
    name: 'První úkol',
    description: 'Splnil/a jsi svůj první úkol!',
    icon: 'star',
  },
  streak_3: {
    id: 'streak_3',
    name: '3 dny v řadě',
    description: '3 dny za sebou všechno splněno!',
    icon: 'fire',
  },
  streak_7: {
    id: 'streak_7',
    name: 'Týdenní šampion',
    description: 'Celý týden bez přerušení!',
    icon: 'trophy',
  },
  streak_30: {
    id: 'streak_30',
    name: 'Měsíční hvězda',
    description: '30 dní perfektního plnění!',
    icon: 'crown',
  },
  perfect_day: {
    id: 'perfect_day',
    name: 'Perfektní den',
    description: 'Všechny úkoly splněny za jeden den!',
    icon: 'check-circle',
  },
  early_bird: {
    id: 'early_bird',
    name: 'Ranní ptáče',
    description: 'Splnil/a jsi úkol před 8:00!',
    icon: 'weather-sunny',
  },
  night_owl: {
    id: 'night_owl',
    name: 'Noční sova',
    description: 'Splnil/a jsi úkol po 20:00!',
    icon: 'weather-night',
  },
  task_master_10: {
    id: 'task_master_10',
    name: 'Začátečník',
    description: 'Celkem 10 splněných úkolů!',
    icon: 'numeric-10-circle',
  },
  task_master_50: {
    id: 'task_master_50',
    name: 'Pokročilý',
    description: 'Celkem 50 splněných úkolů!',
    icon: 'medal',
  },
  task_master_100: {
    id: 'task_master_100',
    name: 'Mistr úkolů',
    description: 'Celkem 100 splněných úkolů!',
    icon: 'trophy-award',
  },
};

class AchievementService {
  private achievements: Achievement[] = [];

  /**
   * Load achievements from storage
   */
  async loadAchievements(): Promise<Achievement[]> {
    try {
      const stored = await AsyncStorage.getItem(StorageKeys.ACHIEVEMENTS);
      this.achievements = stored ? JSON.parse(stored) : [];
      return this.achievements;
    } catch (error) {
      console.error('Error loading achievements:', error);
      return [];
    }
  }

  /**
   * Save achievements to storage
   */
  private async saveAchievements(): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageKeys.ACHIEVEMENTS, JSON.stringify(this.achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  /**
   * Get all achievements with their unlocked status
   */
  getAllAchievements(): Achievement[] {
    return Object.values(ACHIEVEMENT_DEFINITIONS).map(def => {
      const unlocked = this.achievements.find(a => a.id === def.id);
      return {
        ...def,
        unlockedAt: unlocked?.unlockedAt,
      };
    });
  }

  /**
   * Get only unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    return this.achievements;
  }

  /**
   * Check if an achievement is unlocked
   */
  isUnlocked(achievementId: AchievementId): boolean {
    return this.achievements.some(a => a.id === achievementId);
  }

  /**
   * Unlock an achievement
   * Returns the achievement if newly unlocked, null if already unlocked
   */
  async unlockAchievement(achievementId: AchievementId): Promise<Achievement | null> {
    if (this.isUnlocked(achievementId)) {
      return null;
    }

    const definition = ACHIEVEMENT_DEFINITIONS[achievementId];
    if (!definition) {
      return null;
    }

    const achievement: Achievement = {
      ...definition,
      unlockedAt: new Date().toISOString(),
    };

    this.achievements.push(achievement);
    await this.saveAchievements();

    return achievement;
  }

  /**
   * Check and unlock achievements based on current state
   * Returns array of newly unlocked achievements
   */
  async checkAchievements(
    dailyStates: DailyTaskState[],
    streak: number,
    todayCompleted: number,
    todayTotal: number
  ): Promise<Achievement[]> {
    const newAchievements: Achievement[] = [];

    // Total completed tasks
    const totalCompleted = dailyStates.filter(s => s.completed).length;

    // First task
    if (totalCompleted >= 1) {
      const achievement = await this.unlockAchievement('first_task');
      if (achievement) newAchievements.push(achievement);
    }

    // Task master achievements
    if (totalCompleted >= 10) {
      const achievement = await this.unlockAchievement('task_master_10');
      if (achievement) newAchievements.push(achievement);
    }
    if (totalCompleted >= 50) {
      const achievement = await this.unlockAchievement('task_master_50');
      if (achievement) newAchievements.push(achievement);
    }
    if (totalCompleted >= 100) {
      const achievement = await this.unlockAchievement('task_master_100');
      if (achievement) newAchievements.push(achievement);
    }

    // Perfect day
    if (todayTotal > 0 && todayCompleted === todayTotal) {
      const achievement = await this.unlockAchievement('perfect_day');
      if (achievement) newAchievements.push(achievement);
    }

    // Streak achievements
    if (streak >= 3) {
      const achievement = await this.unlockAchievement('streak_3');
      if (achievement) newAchievements.push(achievement);
    }
    if (streak >= 7) {
      const achievement = await this.unlockAchievement('streak_7');
      if (achievement) newAchievements.push(achievement);
    }
    if (streak >= 30) {
      const achievement = await this.unlockAchievement('streak_30');
      if (achievement) newAchievements.push(achievement);
    }

    return newAchievements;
  }

  /**
   * Check time-based achievement (early bird / night owl)
   * Call this when a task is completed
   */
  async checkTimeBasedAchievement(): Promise<Achievement | null> {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 8) {
      return await this.unlockAchievement('early_bird');
    }

    if (hours >= 20) {
      return await this.unlockAchievement('night_owl');
    }

    return null;
  }

  /**
   * Get count of unlocked achievements
   */
  getUnlockedCount(): number {
    return this.achievements.length;
  }

  /**
   * Get total number of achievements
   */
  getTotalCount(): number {
    return Object.keys(ACHIEVEMENT_DEFINITIONS).length;
  }
}

// Export singleton instance
export const achievementService = new AchievementService();

// Export for component use
export { ACHIEVEMENT_DEFINITIONS };
