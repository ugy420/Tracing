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

const QuizHomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const categories = [
    {
      id: 1,
      name: 'སེམས་ཅན',
      color: '#FF9EAA',
      //   image: require('../assets/animal_bg.jpg'),
    },
    {
      id: 2,
      name: 'ཤིང་འབྲས',
      color: '#A2D2FF',
      //   image: require('../assets/fruit_bg.jpg'),
    },
    {
      id: 3,
      name: 'མི་གི་གཟུགས་',
      color: '#BDE0FE',
      //   image: require('../assets/body_bg.jpg'),
    },
  ];

  const handleCategoryPress = category => {
    // Navigate to the quiz screen for the selected category
    navigation.navigate('QuizScreen');
  };

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>འདྲི་རྩད་དབྱེ་ཁག</Text>

        <View style={styles.cardsContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.card, {backgroundColor: category.color}]}
              onPress={() => handleCategoryPress(category)}>
              <ImageBackground
                source={category.image}
                style={styles.cardBackground}
                imageStyle={styles.cardImageStyle}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{category.name}</Text>
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

const {width, height} = Dimensions.get('window');

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
