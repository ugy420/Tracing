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

type QuizItem = {
  id: number;
  name: string;
  color: string;
  image: any;
  category: string;
  screen: keyof RootStackParamList;
  englishName: string;
  icon: string;
  relatedTo: string[]; // New property to determine which category it belongs to
};

const QuizHomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'QuizHomeScreen'>>();
  const {quizCategory} = route.params || {quizCategory: 'all'};

  const [dimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  const isLandscape = dimensions.window.width > dimensions.window.height;

  // Define all available quiz categories with relatedTo property
  const allCategories: QuizItem[] = [
    {
      id: 1,
      name: 'སེམས་ཅན།',
      image: require('../assets/quiz_images/deer.png'),
      category: 'animals',
      screen: 'QuizScreen',
      englishName: 'Animals',
      color: 'rgb(86, 191, 236)',
      icon: '🐾',
      relatedTo: ['all', 'alphabets'],
    },
    {
      id: 2,
      name: 'ཤིང་འབྲས།',
      image: require('../assets/quiz_images/deer.png'),
      category: 'fruits',
      screen: 'QuizScreen',
      englishName: 'Fruits',
      color: 'rgb(153, 221, 136)',
      icon: '🍉',
      relatedTo: ['all', 'alphabets'],
    },
    {
      id: 3,
      name: 'གྲངས་ཀ།',
      image: require('../assets/quiz_images/deer.png'),
      category: 'counting',
      screen: 'QuizScreen',
      englishName: 'Counting',
      color: 'rgb(219, 114, 140)',
      icon: '🎲',
      relatedTo: ['all', 'numbers'],
    },
  ];

  // Filter categories based on quizCategory param
  const categories =
    quizCategory === 'all'
      ? allCategories
      : allCategories.filter(item => item.relatedTo.includes(quizCategory));

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
                onPress={() => navigation.goBack()}
                style={styles.headerButton}>
                <Image
                  source={require('../assets/icons/back_color.png')}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text
                  style={[styles.title, isLandscape && styles.titleLandscape]}>
                  འདྲི་རྩད་དབྱེ་ཁག
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
                    })
                  }>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.cardTitle,
                        isLandscape && styles.cardTitleLandscape,
                      ]}>
                      {item.name}
                    </Text>
                    <Text style={styles.cardEnglishName}>
                      {item.englishName}
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
    height: normalize(70), // Reduced from 90
    marginVertical: normalize(5), // Reduced from 6
    borderRadius: normalize(16), // Reduced from 20
    overflow: 'hidden',
    elevation: 5, // Slightly reduced shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  cardLandscape: {
    width: '30%',
    height: normalize(110), // Reduced from 140
  },
  cardContent: {
    flex: 1,
    padding: normalize(12), // Reduced from 20
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardIcon: {
    fontSize: normalize(24), // Reduced from 30
    marginBottom: normalize(6), // Reduced from 10
  },
  cardTitle: {
    fontSize: normalize(22), // Reduced from 28
    fontFamily: 'joyig',
    color: '#333',
    textAlign: 'center',
  },
  cardTitleLandscape: {
    fontSize: normalize(18), // Reduced from 22
  },
  cardEnglishName: {
    fontSize: normalize(10), // Reduced from 12
    color: '#333',
    fontWeight: '600',
    marginTop: normalize(2), // Reduced from 3
  },
});

export default QuizHomeScreen;
