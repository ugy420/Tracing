import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import CardCategory from '../components/CardCategory';
import {cardAlphabetData} from '../components/alphabetCardData';
import {cardNumberData} from '../components/numberCardData';
import {useMusic} from '../components/MusicContext';
import LottieView from 'lottie-react-native';
import {useLanguage} from '../context/languageContext'; // Import language context

const {width, height} = Dimensions.get('window');

// Define translation types
type TranslationKey = 'category' | 'quiz' | 'loading' | 'alphabets' | 'numbers';
type LanguageKey = 'Eng' | 'Dzo';
type TranslationsType = {
  [key in LanguageKey]: {
    [subKey in TranslationKey]: string;
  };
};

const GuidedCategory = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'GuidedCategory'>>();
  const {category} = route.params; // Get the category parameter
  const {isMuted, toggleMute} = useMusic();
  const [loading, setLoading] = useState(false);
  
  // Get language context
  const {language} = useLanguage();

  // Text translations based on selected language
  const translations: TranslationsType = {
    Eng: {
      category: 'Category',
      quiz: 'Attempt Quiz',
      loading: 'Loading...',
      alphabets: 'Alphabets',
      numbers: 'Numbers',
    },
    Dzo: {
      category: 'དབྱེ་རིམ།',
      quiz: 'འདྲི་རྩད་ རྒྱུགས',
      loading: 'བསྒུག...',
      alphabets: 'གསལ་བྱེད།',
      numbers: 'ཨང་ཡིག།',
    },
  };

  // Get text based on current language
  const getText = (key: TranslationKey): string => {
    return translations[language as LanguageKey][key] || translations['Eng'][key];
  };

  // Function to get language-specific font size
  const getFontSize = (baseSize: number): number => {
    return language === 'Dzo'
      ? baseSize * 1.25 // 25% larger for Dzongkha
      : baseSize;
  };

  const cardData =
    category === 'alphabets'
      ? cardAlphabetData
      : category === 'numbers'
      ? cardNumberData
      : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/lottie_anime/cat_loading.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text style={[styles.loadingText, {
          fontFamily: language === 'Dzo' ? 'joyig' : undefined,
          fontSize: getFontSize(18),
        }]}>
          {getText('loading')}
        </Text>
      </View>
    );
  }

  // Create dynamic styles based on language
  const dynamicStyles = StyleSheet.create({
    categoryText: {
      fontFamily: language === 'Dzo' ? 'joyig' : undefined,
      color: '#4B0082',
      fontSize: getFontSize(language === 'Dzo' ? 55 : 32),
      lineHeight: language === 'Dzo' ? 70 : 58,
      marginTop: 5,
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.1)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
    },
    quizButtonText: {
      color: 'white',
      fontSize: getFontSize(language === 'Dzo' ? 52 : 22),
      fontFamily: language === 'Dzo' ? 'joyig' : undefined,
      textAlign: 'center',
    },
  });

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.navigate('Guided')}>
              <Image
                source={require('../assets/icons/back_color.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={dynamicStyles.categoryText}>{getText('category')}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleMute}>
              <Image
                source={
                  isMuted
                    ? require('../assets/icons/mute.png')
                    : require('../assets/icons/volume.png')
                }
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('SettingScreen')}>
              <Image
                source={require('../assets/icons/setting_color.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <FlatList
            data={cardData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  setLoading(true);
                  setTimeout(() => {
                    navigation.navigate(item.screen, {id: item.id, category});
                    setLoading(false);
                  }, 500);
                }}>
                <CardCategory
                  text={item.text}
                  backgroundColor={item.backgroundColor}
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            horizontal={true}
            contentContainerStyle={styles.cardContainer}
            showsHorizontalScrollIndicator={false}
            snapToInterval={120}
            decelerationRate="fast"
          />

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() =>
              navigation.navigate('QuizHomeScreen', {quizCategory: category})
            }>
            <Text style={dynamicStyles.quizButtonText}>{getText('quiz')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    paddingInline: 25,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
    elevation: 5,
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
  loadingText: {
    marginTop: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default GuidedCategory;