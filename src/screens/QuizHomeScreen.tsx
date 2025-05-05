import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {RootStackParamList} from '../types';
import {useNavigation, NavigationProp} from '@react-navigation/native';

type QuizItem = {
  id: number;
  name: string;
  color: string;
  image: any;
  category: string;
  screen: keyof RootStackParamList;
};

const QuizHomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const categories: QuizItem[] = [
    {
      id: 1,
      name: 'སེམས་ཅན',
      color: '#FF9EAA',
      image: require('../assets/quiz_images/deer.png'),
      category: 'animals',
      screen: 'QuizScreen',
    },
    {
      id: 2,
      name: 'ཤིང་འབྲས',
      color: '#A2D2FF',
      image: require('../assets/quiz_images/deer.png'),
      category: 'fruits',
      screen: 'QuizScreen',
    },
    {
      id: 3,
      name: 'མི་གི་གཟུགས་',
      color: '#BDE0FE',
      image: require('../assets/quiz_images/deer.png'),
      category: 'body',
      screen: 'QuizScreen',
    },
  ];

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>འདྲི་རྩད་དབྱེ་ཁག</Text>

        <View style={styles.cardsContainer}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, {backgroundColor: item.color}]}
              onPress={() =>
                navigation.navigate(item.screen as any, {
                  category: item.category,
                })
              }>
              <ImageBackground
                source={item.image}
                style={styles.cardBackground}
                imageStyle={styles.cardImageStyle}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSubtitle}>Tap to start quiz</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: height * 0.15,
    fontFamily: 'joyig',
    textAlign: 'center',
    color: '#333',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  card: {
    height: height * 0.25,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageStyle: {
    opacity: 0.8,
  },
  cardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: height * 0.14,
    fontFamily: 'joyig',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#555',
  },
});

export default QuizHomeScreen;
