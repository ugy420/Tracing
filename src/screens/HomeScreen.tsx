import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import NetInfo from 'react-native';
import {useMusic} from '../components/MusicContext';
import {useLanguage} from '../context/languageContext';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {isMuted, toggleMute} = useMusic();
  const {language, setLanguage} = useLanguage();

  const handleGuestMode = async () => {
    try {
      // generate unique ID for guest user
      const guestId = uuid.v4().toString();

      const existingStarCount = await AsyncStorage.getItem('guest_starCount');

      if (!existingStarCount) {
        await AsyncStorage.setItem('guest_starCount', '0');
      }

      // store guest data in AsyncStorage
      await AsyncStorage.setItem('guestId', guestId);
      await AsyncStorage.setItem('is_guest', 'true');

      // navigate to Guided Screen
      navigation.navigate('Guided');
    } catch (error) {
      console.error('Error setting up guest data:', error);
      Alert.alert('Error', 'Failed to start guest session. Please try again.');
    }
  };

  const handleOnlineMode = async () => {
    try {
      // Check network connectivity
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        console.log('Online mode selected');
        navigation.navigate('Login');
      } else {
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection.',
        );
      }
    } catch (error) {
      console.error('Error checking network connectivity:', error);
      Alert.alert(
        'Error',
        'Failed to check network connectivity. Please try again.',
      );
    }
  };

  // Handle language toggle switch
  const handleLanguageToggle = (value) => {
    setLanguage(value ? 'Dzo' : 'Eng');
  };

  return (
    <ImageBackground
      source={require('../assets/background_images/home_bg.png')}
      style={styles.background}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text
            style={
              language === 'Eng' ? styles.headerText : styles.headerTextDzo
            }>
            {language === 'Eng' ? 'SELECT MODE' : 'རྩེད་ཀྱི་ཐབས་ལམ་གདམ་ཁ་རྐྱབ།'}
          </Text>
        </View>
        <View style={styles.headerIcons}>
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

      <View style={styles.container}>
        <View style={styles.languageToggleContainer}>
          <Text style={styles.languageLabel}>Eng</Text>
          <Switch
            trackColor={{false: '#2E6283', true: '#5E2B97'}}
            thumbColor={language === 'Dzo' ? '#FFD700' : '#FFFFFF'}
            ios_backgroundColor="#2E6283"
            onValueChange={handleLanguageToggle}
            value={language === 'Dzo'}
            style={styles.languageSwitch}
          />
          <Text style={styles.languageLabel}>Dzo</Text>
        </View>
        <View style={styles.textBg}>
          <TouchableOpacity onPress={handleOnlineMode}>
            <Text
              style={language === 'Eng' ? styles.modeText : styles.modeDzoText}>
              {language === 'Eng' ? 'Online' : 'ཡོངས་འབྲེལ།'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textBg}>
          <TouchableOpacity onPress={handleGuestMode}>
            <Text
              style={language === 'Eng' ? styles.modeText : styles.modeDzoText}>
              {language === 'Eng' ? 'Guest' : 'མགྱོནམོ་སྦེ་རྩེདམོ་རྩེ།'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    position: 'absolute',
    top: 0,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Unlock-Bold',
    fontSize: 40,
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    // Shadow
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 5, height: 5},
    textShadowRadius: 5,

    padding: 10,
    letterSpacing: 1.5,
  },
  headerTextDzo: {
    fontFamily: 'joyig',
    fontSize: 40,
    color: 'rgb(255, 255, 255)',
    // Shadow
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 5, height: 5},
    textShadowRadius: 5,

    padding: 10,
    letterSpacing: 1.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
  headerIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  container: {
    marginTop: '10%',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeText: {
    fontSize: 40,
    color: 'rgb(200, 213, 236)',
    fontWeight: 'bold',
  },
  modeDzoText: {
    fontFamily: 'joyig',
    fontSize: 40,
    color: 'rgb(200, 213, 236)',
  },
  textBg: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    padding: 10,
    backgroundColor: '#2E6283',
    borderRadius: 30,
    margin: 10,
  },
  languageToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  languageSwitch: {
    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
  },
});

export default HomeScreen;