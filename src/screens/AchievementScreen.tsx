import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Modal,
  Text,
  Alert,
} from 'react-native';
import achievement from '../assets/achievementImages';
import {RootStackParamList} from '../types';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import axiosInstance from '../Api/config/axiosInstance';
import api from '../Api/endPoints';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import {useLanguage} from '../context/languageContext'; // Import language context

const {width, height} = Dimensions.get('window');

// Define language string literal type
type LanguageType = 'Eng' | 'Dzo';

// Define translation key type
type TranslationKey =
  | 'loading'
  | 'closeButton'
  | 'achievementTitle'
  | 'criteria'
  | 'error'
  | 'failedToLoad'
  | 'brightStar'
  | 'numberMaster'
  | 'vowelStar'
  | 'animalGenius'
  | 'fruitGenius'
  | 'CountingGenius'
  | 'CountingGenius'
  | 'completeConsonants'
  | 'completeNumbers'
  | 'completeVowels'
  | 'completeAnimalQuiz'
  | 'completeFruitQuiz'
  | 'completeCountingQuiz';

// Define the type for a single language's translations
type TranslationsForLanguage = {
  [key in TranslationKey]: string;
};

// Define the type for all translations
type TranslationsType = {
  [key in LanguageType]: TranslationsForLanguage;
};

const AchievementScreen = () => {
  const [achievements, setAchievements] = useState<
    {
      id: number;
      is_earned: boolean;
      name?: string;
      criteria?: string;
      image?: any;
    }[]
  >([]);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Get language context
  const {language} = useLanguage();

  // Ensure language is typed correctly
  const currentLanguage: LanguageType = (language as LanguageType) || 'Eng';

  // Text translations based on selected language
  const translations: TranslationsType = {
    Eng: {
      loading: 'Loading...',
      closeButton: 'Close',
      achievementTitle: 'Achievement',
      criteria: 'Criteria',
      error: 'Error',
      failedToLoad: 'Failed to load achievements.',
      // Achievement names
      brightStar: 'Bright Star Badge',
      numberMaster: 'Number Master Badge',
      vowelStar: 'Vowel Star Badge',
      animalGenius: 'Animal Genius Badge',
      fruitGenius: 'Fruit Genius Badge',
      CountingGenius: 'Counting Genius Badge',
      // Achievement criteria
      completeConsonants: 'Complete all tracing of consonants!',
      completeNumbers: 'Complete all tracing of numbers!',
      completeVowels: 'Complete all tracing of vowels!',
      completeAnimalQuiz: 'Complete the animal quiz!',
      completeFruitQuiz: 'Complete the fruit quiz!',
      completeCountingQuiz: 'Complete the counting quiz!',
    },
    Dzo: {
      loading: 'བསྒུག...',
      closeButton: 'ཁ་བསྡམ་ནི།',
      achievementTitle: 'རྒྱལ་རྟགས།',
      criteria: 'ཆ་རྐྱེན།',
      error: 'ནོར་འཁྲུལ།',
      failedToLoad: 'རྒྱལ་རྟགས་ཚུ་མཐོང་མ་ཚུགས།',
      // Achievement names
      brightStar: 'གསལ་བྱེད་ རྒྱལ་རྟགས།',
      numberMaster: 'གྱངས་ཁ་མཁས་པའི་རྟགས།',
      vowelStar: 'དབྱངས་ཡིག་སྐར་མའི་རྟགས།',
      animalGenius: 'སེམས་ཅན་མཁས་པའི་རྟགས།',
      fruitGenius: 'ཤིང་འབྲས་མཁས་པའི་རྟགས།',
      CountingGenius: 'གྱངས་ཁ་མཁས་པའི་རྟགས།',
      // Achievement criteria
      completeConsonants: 'གསལ་བྱེད་ག་ར་ འཁྱིད་ཐིག་འབད།',
      completeNumbers: 'གྱངས་ཁ་ཚུ་ ཆ་ཚང་རྗེས་འདེད་ འབད་ནི་ཚར་བཅུག',
      completeVowels: 'དབྱངས་ཡིག་ཚུ་ ཆ་ཚང་རྗེས་འདེད་ འབད་ནི་ཚར་བཅུག',
      completeAnimalQuiz: 'སེམས་ཅན་གྱི་ དྲི་བ་དྲིས་ལན་ཚར་བཅུག',
      completeFruitQuiz: 'ཤིང་འབྲས་ཀྱི་ དྲི་བ་དྲིས་ལན་ཚར་བཅུག',
      completeCountingQuiz: 'གྱངས་ཁ་ཀྱི་ དྲི་བ་དྲིས་ལན་ཚར་བཅུག',
    },
  };

  // Get text based on current language
  const getText = (key: TranslationKey): string => {
    return translations[currentLanguage][key] || translations['Eng'][key];
  };

  // Function to get language-specific font size
  const getFontSize = (baseSize: number): number => {
    return currentLanguage === 'Dzo'
      ? baseSize * 1.25 // 25% larger for Dzongkha
      : baseSize;
  };

  // Achievements
  useEffect(() => {
    setLoading(true);
    // Fetching user achievements and combine with local achievements
    const fetchAchievements = async () => {
      try {
        // Guest Mode
        // Check if the user is a guest
        const isGuestValue = await AsyncStorage.getItem('is_guest');
        setIsGuest(isGuestValue === 'true');

        if (isGuestValue === 'true') {
          // Guest Mode: Use local mock data but check which achievements are unlocked
          const guestAchievements = await AsyncStorage.getItem(
            'guest_achievements',
          );
          const unlockedAchievements = guestAchievements
            ? JSON.parse(guestAchievements)
            : {};

          const localAchievements = [
            {
              id: 1,
              name: getText('brightStar'),
              criteria: getText('completeConsonants'),
              image: achievement.achievement1,
              is_earned: !!unlockedAchievements.achievement1,
            },
            {
              id: 2,
              name: getText('numberMaster'),
              criteria: getText('completeNumbers'),
              image: achievement.achievement2,
              is_earned: !!unlockedAchievements.achievement2,
            },
            {
              id: 3,
              name: getText('vowelStar'),
              criteria: getText('completeVowels'),
              image: achievement.achievement8,
              is_earned: !!unlockedAchievements.achievement3,
            },
            {
              id: 4,
              name: getText('animalGenius'),
              criteria: getText('completeAnimalQuiz'),
              image: achievement.achievement4,
              is_earned: !!unlockedAchievements.achievement4,
            },
            {
              id: 5,
              name: getText('fruitGenius'),
              criteria: getText('completeFruitQuiz'),
              image: achievement.achievement5,
              is_earned: !!unlockedAchievements.achievement5,
            },
            {
              id: 6,
              name: getText('CountingGenius'),
              criteria: getText('completeCountingQuiz'),
              image: achievement.achievement6,
              is_earned: !!unlockedAchievements.achievement6,
            },
          ];
          setAchievements(localAchievements);
        } else {
          // Online Mode
          const response = await axiosInstance.get(
            api.achievement.getUserAchievements,
          );

          // Get all the achievements
          const allAchievementsResponse = await axiosInstance.get(
            api.achievement.getAchievements,
          );

          const userAchievements = response.data || [];
          const allAchievements = allAchievementsResponse.data;

          const combinedAchievements = allAchievements.map(
            (achievementItem: any, index: number) => ({
              ...achievementItem,
              image:
                achievement[
                  `achievement${index + 1}` as keyof typeof achievement
                ],
              is_earned: userAchievements.some(
                (userAchievement: any) =>
                  userAchievement.id === achievementItem.id,
              ),
            }),
          );
          setAchievements(combinedAchievements);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
        Alert.alert(getText('error'), getText('failedToLoad'));
      } finally {
        setLoading(false);
      }
    };

    Orientation.lockToLandscape();
    fetchAchievements();
  }, []);

  // Create dynamic styles based on language and screen dimensions
  const dynamicStyles = StyleSheet.create({
    modalTitle: {
      fontFamily: currentLanguage === 'Dzo' ? 'joyig' : undefined,
      fontSize: getFontSize(
        currentLanguage === 'Dzo' ? height * 0.12 : height * 0.06,
      ),
      marginBottom: 3,
    },
    modalCriteria: {
      fontSize: getFontSize(
        currentLanguage === 'Dzo' ? height * 0.09 : height * 0.05,
      ),
      fontFamily: currentLanguage === 'Dzo' ? 'joyig' : undefined,
      marginBottom: 20,
      textAlign: 'center',
      color: 'gray',
    },
    loadingText: {
      fontFamily: currentLanguage === 'Dzo' ? 'joyig' : undefined,
      fontSize: getFontSize(16),
    },
  });

  const handleAchievementPress = (item: any) => {
    setSelectedAchievement(item);
    setModalVisible(true);
  };

  const renderAchievement = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.avatarContainer}
      onPress={() => handleAchievementPress(item)}>
      <Image
        source={item.image}
        style={[
          styles.avatarImage,
          item.is_earned
            ? styles.earnedAchievement
            : styles.unearnedAchievement,
        ]}
      />
    </TouchableOpacity>
  );

  if (loading) {
    // Show loading indicator while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/lottie_anime/cat_loading.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text style={dynamicStyles.loadingText}>{getText('loading')}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Guided')}>
          <Image
            source={require('../assets/icons/back_color.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarWindow}>
        <Image
          source={require('../assets/icons/avatarWindow.png')}
          style={styles.avatarWindowImage}
        />
        <View style={styles.containerWrapper}>
          <View style={styles.container}>
            <FlatList
              data={achievements}
              keyExtractor={item => item.id.toString()}
              numColumns={4}
              contentContainerStyle={styles.flatListStyle}
              renderItem={renderAchievement}
            />
          </View>
        </View>

        {selectedAchievement && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeIconButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeIcon}>×</Text>
                </TouchableOpacity>

                 {/* Add the achievement image here */}

                <Text style={dynamicStyles.modalTitle}>
                  {selectedAchievement.name}
                </Text>

                {/* Achievement Image */}
                {selectedAchievement.image && (
                  <Image
                    source={selectedAchievement.image}
                    style={styles.modalAchievementImage}
                  />
                )}

                <Text style={dynamicStyles.modalCriteria}>
                  {selectedAchievement.criteria}
                </Text>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: height * 0.18, // Added padding to move content lower
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ensure it stays within bounds
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    position: 'absolute',
    top: 0,
  },
  headerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  avatarWindow: {
    width: width * 0.6,
    height: height * 0.6,
    padding: 10,
    marginBottom: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWindowImage: {
    position: 'absolute',
    width: '110%',
    height: '160%',
    resizeMode: 'stretch',
  },
  flatListStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '140%',
    paddingBottom: height * 0.02,
  },
  avatarContainer: {
    margin: 5,
    width: (width * 0.6) / 4 - 20,
    height: (height * 0.6) / 3 - 10,
    backgroundColor: '#64748B',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  earnedAchievement: {
    borderColor: 'gold',
    borderWidth: 2,
  },
  unearnedAchievement: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeIconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 30,
    color: '#DC3545',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  modalAchievementImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 15,
    // For earned achievements, you can add special styling
    borderWidth: 2,
    borderColor: 'gold',
    borderRadius: 10,
  }
});

export default AchievementScreen;
