import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import {RootStackParamList} from '../types';
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {useLanguage} from '../context/languageContext'; // Ensure this path matches your project structure

type QuizItem = {
  id: number;
  nameDzo: string;
  nameEn: string;
  color: string;
  image: any;
  category: string;
  screen: keyof RootStackParamList;
  icon: string;
  relatedTo: string[];
};

const QuizHomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'QuizHomeScreen'>>();
  const {quizCategory, fromCompletionScreen} = route.params || {
    quizCategory: 'all',
    fromCompletionScreen: false,
  };
  const {language} = useLanguage();

  const [dimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  const isLandscape = dimensions.window.width > dimensions.window.height;

  // Define all available quiz categories with bilingual names
  const allCategories: QuizItem[] = [
    {
      id: 1,
      nameDzo: 'སེམས་ཅན།',
      nameEn: 'Animals',
      image: require('../assets/quiz_images/deer.png'),
      category: 'animals',
      screen: 'QuizScreen',
      icon: '🐾',
      color: 'rgb(86, 191, 236)',
      relatedTo: ['all', 'alphabets'],
    },
    {
      id: 2,
      nameDzo: 'ཤིང་འབྲས།',
      nameEn: 'Fruits',
      image: require('../assets/quiz_images/deer.png'),
      category: 'fruits',
      screen: 'QuizScreen',
      icon: '🍉',
      color: 'rgb(153, 221, 136)',
      relatedTo: ['all', 'alphabets'],
    },
    {
      id: 4,
      nameDzo: 'གྲངས་ཀ།',
      nameEn: 'Counting',
      image: require('../assets/quiz_images/deer.png'),
      category: 'counting',
      screen: 'QuizScreen',
      icon: '🎲',
      color: 'rgb(219, 114, 140)',
      relatedTo: ['all', 'numbers'],
    },
  ];

  // Filter categories based on quizCategory param
  const categories =
    quizCategory === 'all'
      ? allCategories
      : allCategories.filter(item => item.relatedTo.includes(quizCategory));

  console.log('Received quizCategory:', quizCategory);
  console.log('Filtered Categories:', categories);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../assets/background_images/guided_bg.jpeg')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                // onPress={() => navigation.goBack()}
                onPress={() => {
                  if (fromCompletionScreen) {
                    navigation.navigate('GuidedCategory', {
                      category: quizCategory,
                    }); // Navigate to GuidedCategoryScreen
                  } else {
                    navigation.goBack(); // Default behavior
                  }
                }}
                style={styles.headerButton}>
                <Image
                  source={require('../assets/icons/back_color.png')}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text
                  style={[styles.title, isLandscape && styles.titleLandscape]}>
                  {language === 'Eng' ? 'Quiz Categories' : 'འདྲི་རྩད་དབྱེ་ཁག'}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.cardsContainer,
                isLandscape && styles.cardsContainerLandscape,
              ]}>
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.card,
                    {backgroundColor: item.color},
                    isLandscape && styles.cardLandscape,
                  ]}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate(item.screen as any, {
                      category: item.category,
                      relatedTo: quizCategory,
                    })
                  }>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardIcon}>{item.icon}</Text>

                    <Text
                      style={[
                        styles.cardName,
                        language === 'Eng'
                          ? styles.cardEnglishName
                          : styles.cardDzongkhaName,
                      ]}>
                      {language === 'Eng' ? item.nameEn : item.nameDzo}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Responsive sizing utility
const {width: SCREEN_WIDTH} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Based on standard 375pt width
const normalize = (size: any) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  }
  return Math.round(newSize);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
  },
  container: {
    flex: 1,
    padding: normalize(15),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    position: 'relative',
    width: '100%',
  },
  headerIcon: {
    height: 40,
    width: 40,
    marginLeft: normalize(10),
    resizeMode: 'contain',
  },
  headerButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(34),
    fontFamily: 'joyig',
    textAlign: 'center',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  titleLandscape: {
    fontSize: normalize(26),
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: normalize(5),
    marginTop: normalize(-5),
  },
  cardsContainerLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    height: normalize(70),
    marginVertical: normalize(5),
    borderRadius: normalize(16),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  cardLandscape: {
    width: '30%',
    height: normalize(110),
  },
  cardContent: {
    flex: 1,
    padding: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardIcon: {
    fontSize: normalize(24),
    marginBottom: normalize(6),
  },
  cardName: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: normalize(2),
  },
  cardEnglishName: {
    fontSize: normalize(10),
  },
  cardDzongkhaName: {
    fontSize: normalize(22), // Larger font size for Dzongkha
    fontFamily: 'joyig', // Ensure correct font is used
  },
});

export default QuizHomeScreen;
