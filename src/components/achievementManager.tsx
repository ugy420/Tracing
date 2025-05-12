import AsyncStorage from '@react-native-async-storage/async-storage';

// Achievement IDs based on your achievement screen
const ACHIEVEMENT_IDS = {
  CONSONANTS: 1,
  NUMBERS: 2,
  VOWELS: 3,
  ANIMALS: 4,
  FRUITS: 5,
};

/**
 * Unlock an achievement when a specific quiz is completed
 * @param {string} category - The quiz category (animals, fruits, counting)
 * @returns {Promise<void>}
 */
export const unlockAchievementForQuiz = async (category: any) => {
  try {
    // Check if user is in guest mode
    const isGuest = await AsyncStorage.getItem('is_guest');

    if (isGuest === 'true') {
      // Handle guest mode - store achievements locally
      await unlockGuestAchievement(category);
    } else {
      // Handle regular user - communicate with server
      await unlockUserAchievement(category);
    }

    console.log(`Achievement unlocked for ${category} quiz`);
  } catch (error) {
    console.error('Error unlocking achievement:', error);
  }
};

/**
 * Unlock achievement for guest users (stored locally)
 * @param {string} category - The quiz category
 * @returns {Promise<void>}
 */
const unlockGuestAchievement = async (category: any) => {
  try {
    // Get current achievements
    const achievementsJson = await AsyncStorage.getItem('guest_achievements');
    const achievements = achievementsJson ? JSON.parse(achievementsJson) : [];

    // Determine which achievement to unlock based on the category
    let achievementId;
    switch (category) {
      case 'animals':
        achievementId = ACHIEVEMENT_IDS.ANIMALS;
        break;
      case 'fruits':
        achievementId = ACHIEVEMENT_IDS.FRUITS;
        break;
      case 'counting':
        achievementId = ACHIEVEMENT_IDS.NUMBERS;
        break;
      default:
        return; // No matching achievement for this category
    }

    // Check if achievement is already unlocked
    if (!achievements.includes(achievementId)) {
      // Add to achievements
      achievements.push(achievementId);

      // Save updated achievements
      await AsyncStorage.setItem(
        'guest_achievements',
        JSON.stringify(achievements),
      );
    }
  } catch (error) {
    console.error('Error unlocking guest achievement:', error);
    throw error;
  }
};

/**
 * Unlock achievement for regular users (server communication)
 * @param {string} category - The quiz category
 * @returns {Promise<void>}
 */
const unlockUserAchievement = async (category: any) => {
  try {
    // In a production app, you would make an API call here
    // For now, we'll simulate it with AsyncStorage
    const userAchievementsJson = await AsyncStorage.getItem(
      'user_achievements',
    );
    const userAchievements = userAchievementsJson
      ? JSON.parse(userAchievementsJson)
      : [];

    // Determine which achievement to unlock based on the category
    let achievementId;
    switch (category) {
      case 'animals':
        achievementId = ACHIEVEMENT_IDS.ANIMALS;
        break;
      case 'fruits':
        achievementId = ACHIEVEMENT_IDS.FRUITS;
        break;
      case 'counting':
        achievementId = ACHIEVEMENT_IDS.NUMBERS;
        break;
      default:
        return; // No matching achievement for this category
    }

    // Check if achievement is already unlocked
    if (!userAchievements.includes(achievementId)) {
      // Add to achievements
      userAchievements.push(achievementId);

      // Save updated achievements
      await AsyncStorage.setItem(
        'user_achievements',
        JSON.stringify(userAchievements),
      );

      // In a real implementation, you would also call your API here:
      // await axiosInstance.post(api.achievement.unlockAchievement, { achievementId });
    }
  } catch (error) {
    console.error('Error unlocking user achievement:', error);
    throw error;
  }
};

/**
 * Get all unlocked achievements for the current user mode
 * @returns {Promise<Array<number>>} Array of unlocked achievement IDs
 */
export const getUnlockedAchievements = async () => {
  try {
    const isGuest = await AsyncStorage.getItem('is_guest');

    if (isGuest === 'true') {
      // Get guest achievements
      const achievementsJson = await AsyncStorage.getItem('guest_achievements');
      return achievementsJson ? JSON.parse(achievementsJson) : [];
    } else {
      // Get user achievements
      const userAchievementsJson = await AsyncStorage.getItem(
        'user_achievements',
      );
      return userAchievementsJson ? JSON.parse(userAchievementsJson) : [];
    }
  } catch (error) {
    console.error('Error getting unlocked achievements:', error);
    return [];
  }
};
