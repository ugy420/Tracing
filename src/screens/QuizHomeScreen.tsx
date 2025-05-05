import React, {useEffect, useState} from 'react';
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
  ScrollView,
  Image,
} from 'react-native';
import {RootStackParamList} from '../types';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {topLeft} from '@shopify/react-native-skia';

const QuizHomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  // Handle orientation changes and other dimension updates
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  }, []);

  const isLandscape = dimensions.window.width > dimensions.window.height;

  const categories = [
    {
      id: 1,
      name: 'སེམས་ཅན',
      englishName: 'Animals',
      color: 'rgb(86, 191, 236)',
      icon: '🐼',
    },
    {
      id: 2,
      name: 'ཤིང་འབྲས',
      englishName: 'Fruits',
      color: 'rgb(153, 221, 136)',
      icon: '🍎',
    },
    {
      id: 3,
      name: 'མི་གི་གཟུགས་',
      englishName: 'Body Parts',
      color: 'rgb(155, 217, 210)',
      icon: '👤',
    },
  ];
  interface Category {
    id: number;
    name: string;
    color: string;
    //image: string;
    icon: string;
  }
  const handleCategoryPress = (category: Category) => {
    navigation.navigate('QuizScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../assets/background_images/guided_bg.jpeg')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                    style={[
                      styles.title,
                      isLandscape && styles.titleLandscape,
                    ]}>
                    འདྲི་རྩད་དབྱེ་ཁག
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.cardsContainer,
                  isLandscape && styles.cardsContainerLandscape,
                ]}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.card,
                      {backgroundColor: category.color},
                      isLandscape && styles.cardLandscape,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleCategoryPress(category)}>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardIcon}>{category.icon}</Text>
                      <Text
                        style={[
                          styles.cardTitle,
                          isLandscape && styles.cardTitleLandscape,
                        ]}>
                        {category.name}
                      </Text>
                      <Text style={styles.cardEnglishName}>
                        {category.englishName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Responsive sizing utility
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
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
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: normalize(16),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 5,
    position: 'relative',
    width: '100%',
  },
  headerIcon: {
    height: 40,
    width: 40,
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
    fontSize: normalize(38),
    fontFamily: 'joyig',
    textAlign: 'center',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  titleLandscape: {
    fontSize: normalize(28),
    marginBottom: -10,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: normalize(10),
    marginTop: normalize(0),
  },
  cardsContainerLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    height: normalize(90),
    marginVertical: normalize(6),
    borderRadius: normalize(20),
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  cardLandscape: {
    width: '30%',
    height: normalize(140),
  },
  cardContent: {
    flex: 1,
    padding: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardIcon: {
    fontSize: normalize(30),
    marginBottom: normalize(10),
  },
  cardTitle: {
    fontSize: normalize(28),
    fontFamily: 'joyig',
    color: '#333',
    textAlign: 'center',
  },
  cardTitleLandscape: {
    fontSize: normalize(22),
  },
  cardEnglishName: {
    fontSize: normalize(14),
    color: '#333',
    fontWeight: '600',
    marginTop: normalize(5),
  },
});

export default QuizHomeScreen;
