import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {Dimensions} from 'react-native';
import {RootStackParamList} from '../types';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useLanguage} from '../context/languageContext'; // Ensure this path matches your project structure

const {height, width} = Dimensions.get('window');

const CompletionScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CompletionScreen'>>();
  const {category} = route.params;
  const {language} = useLanguage();

  // Bilingual congratulatory text
  const congratulatoryText = {
    Eng: 'Congratulations!',
    Dzo: 'བཀྲ་ཤིས་བདེ་ལེགས།',
  };

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.backgroundImage}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/icons/boy.png')}
          style={styles.icon}
        />
        <View style={styles.starContainer}>
          <Image
            source={require('../assets/icons/star.png')}
            style={styles.star1}
          />
          <Image
            source={require('../assets/icons/star.png')}
            style={styles.star2}
          />
          <Image
            source={require('../assets/icons/star.png')}
            style={styles.star3}
          />
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text,
              language === 'Eng' ? styles.textEnglish : styles.textDzongkha,
            ]}>
            {language === 'Eng'
              ? congratulatoryText.Eng
              : congratulatoryText.Dzo}
          </Text>
        </View>

        <View style={styles.feedbackIconContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('GuidedCategory', {category})}>
            <Image
              source={require('../assets/icons/nextArrow1.png')}
              style={styles.feedbackIcon}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/icons/girl.png')}
          style={styles.icon}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginHorizontal: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    height: height * 0.6,
    width: width * 0.3,
    resizeMode: 'contain',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  star1: {
    marginTop: height * 0.05,
    height: height * 0.2,
    width: width * 0.1,
    resizeMode: 'contain',
  },
  star2: {
    height: height * 0.2,
    width: width * 0.1,
    resizeMode: 'contain',
  },
  star3: {
    marginTop: height * 0.05,
    height: height * 0.2,
    width: width * 0.1,
    resizeMode: 'contain',
  },
  textContainer: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.15,
    right: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: 'joyig',
    color: '#3e2723',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.7)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 8,
    letterSpacing: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  textEnglish: {
    fontWeight: 'bold',
    fontSize: height * 0.08, // Smaller font size for English
  },
  textDzongkha: {
    fontSize: height * 0.2, // Larger font size for Dzongkha
  },
  feedbackIconContainer: {
    position: 'absolute',
    top: height * 0.5,
    left: width * 0.4,
    right: width * 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackIcon: {
    height: height * 0.1,
    width: width * 0.1,
    resizeMode: 'contain',
  },
});

export default CompletionScreen;
