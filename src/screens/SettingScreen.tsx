import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import Orientation from 'react-native-orientation-locker';
import Slider from '@react-native-community/slider';

const SettingsScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Lock to landscape on mount
  useEffect(() => {
    Orientation.lockToLandscape();
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => {
      subscription?.remove();
    };
  }, []);

  // Update music volume in your global state or context here
  // This would be where you update the volume for your app's background music
  useEffect(() => {
    // Here you would typically update your global music player volume
    // For example, if you're using a context or redux for music:
    // updateBackgroundMusicVolume(musicVolume);
    console.log('Music volume updated to:', musicVolume);
  }, [musicVolume]);

  // Responsive values based on screen dimensions
  const isSmallScreen = dimensions.height < 400;
  const responsiveFontSize = isSmallScreen ? 14 : 16;
  const responsiveButtonHeight = isSmallScreen ? 40 : 50;
  const formWidth = Math.min(dimensions.width * 0.8, 500);
  const titleFontSize = isSmallScreen ? 18 : 22;
  const sectionSpacing = isSmallScreen ? 15 : 20;

  const handleSaveSettings = () => {
    console.log('Settings saved:', {
      notificationsEnabled,
      soundVolume,
      musicVolume,
    });
    Alert.alert('Success', 'Your settings have been saved!');
  };

  const handleGiveFeedback = () => {
    navigation.navigate('FeedbackSection');
  };

  const styles = createStyles(
    responsiveFontSize,
    responsiveButtonHeight,
    formWidth,
    titleFontSize,
    sectionSpacing,
    dimensions.height,
  );

  return (
    <ImageBackground
      source={require('../assets/background_images/home_bg.png')}
      style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../assets/icons/home.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/icons/back_color.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>App Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.centerContainer}>
            <View style={styles.formContainer}>
              {/* Notification Settings */}
              <View style={styles.settingItem}>
                <View style={styles.iconLabelContainer}>
                  <Image
                    source={require('../assets/icons/notification.png')}
                    style={styles.settingIcon}
                  />
                  <Text style={styles.settingLabel}>Enable Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{false: '#767577', true: '#AA75CB'}}
                  thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>

              {/* Sound Volume */}
              <View style={styles.settingItem}>
                <View style={styles.iconLabelContainer}>
                  <Image
                    source={
                      soundVolume > 0
                        ? require('../assets/icons/sound.png')
                        : require('../assets/icons/mute.png')
                    }
                    style={styles.settingIcon}
                  />
                  <Text style={styles.settingLabel}>Sound Volume</Text>
                </View>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={soundVolume}
                    onValueChange={setSoundVolume}
                    minimumTrackTintColor="#AA75CB"
                    maximumTrackTintColor="#767577"
                    thumbTintColor="#f4f3f4"
                  />
                  <Text style={styles.volumeText}>
                    {Math.round(soundVolume * 100)}%
                  </Text>
                </View>
              </View>

              {/* Music Volume Control */}
              <View style={styles.settingItem}>
                <View style={styles.iconLabelContainer}>
                  <Image
                    source={
                      musicVolume > 0
                        ? require('../assets/icons/music.png')
                        : require('../assets/icons/music-off.png')
                    }
                    style={styles.settingIcon}
                  />
                  <Text style={styles.settingLabel}>Background Music Volume</Text>
                </View>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={musicVolume}
                    onValueChange={setMusicVolume}
                    minimumTrackTintColor="#AA75CB"
                    maximumTrackTintColor="#767577"
                    thumbTintColor="#f4f3f4"
                  />
                  <Text style={styles.volumeText}>
                    {Math.round(musicVolume * 100)}%
                  </Text>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSaveSettings}>
                <Text style={styles.buttonText}>SAVE SETTINGS</Text>
              </TouchableOpacity>

              {/* Feedback Button */}
              <TouchableOpacity
                style={[styles.button, styles.feedbackButton]}
                onPress={handleGiveFeedback}>
                <Text style={styles.buttonText}>GIVE FEEDBACK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const createStyles = (
  fontSize: number,
  buttonHeight: number,
  formWidth: number,
  titleFontSize: number,
  sectionSpacing: number,
  screenHeight: number,
) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(183, 179, 179, 0.17)',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      minHeight: screenHeight,
    },
    headerIcon: {
      height: 40,
      width: 40,
      resizeMode: 'contain',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    formContainer: {
      width: formWidth,
      maxWidth: 500,
      backgroundColor: 'rgba(112, 109, 109, 0.57)',
      borderRadius: 12,
      padding: 20,
      marginVertical: 10,
    },
    title: {
      fontSize: titleFontSize,
      fontWeight: 'bold',
      color: '#fff',
      paddingStart: 300,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
    },
    settingItem: {
      marginBottom: sectionSpacing,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    iconLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    settingIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
      resizeMode: 'contain',
    },
    settingLabel: {
      fontSize: fontSize,
      color: '#fff',
      fontWeight: '600',
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    slider: {
      flex: 1,
      height: 30,
      marginRight: 10,
    },
    volumeText: {
      color: '#fff',
      width: 50,
      textAlign: 'right',
    },
    button: {
      backgroundColor: '#AA75CB',
      height: buttonHeight,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: sectionSpacing,
    },
    feedbackButton: {
      backgroundColor: '#4A90E2',
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: fontSize,
      fontWeight: 'bold',
    },
  });

export default SettingsScreen;