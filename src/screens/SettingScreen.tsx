import React, {useState, useEffect, useRef} from 'react';
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
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import Orientation from 'react-native-orientation-locker';
import Slider from '@react-native-community/slider';
import {useMusic} from '../components/MusicContext';

const SettingsScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.7);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showHomeButton, setShowHomeButton] = useState(false);

  // Use music context for global music control
  const {volume, updateVolume} = useMusic();

  // Refs to prevent flicker
  const soundVolumeRef = useRef(soundVolume);
  const musicVolumeRef = useRef(volume);

  // Lock to landscape on mount
  useEffect(() => {
    Orientation.lockToLandscape();

    const state = navigation.getState();
    const previousRoute = state.routes[state.routes.length - 2]?.name || null;

    if (previousRoute === 'Home') {
      setShowHomeButton(false);
    } else {
      setShowHomeButton(true);
    }
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => {
      subscription?.remove();
    };
  }, [navigation]);

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
      musicVolume: volume,
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
    dimensions,
  );

  // Handle sound volume change with type annotation
  const handleSoundVolumeChange = (value: number) => {
    soundVolumeRef.current = value;
    setSoundVolume(value);
  };

  // Handle music volume change with type annotation
  const handleMusicVolumeChange = (value: number) => {
    musicVolumeRef.current = value;
    updateVolume(value);
  };

  return (
    <ImageBackground
      source={require('../assets/background_images/home_bg.png')}
      style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerNavigation}>
            {showHomeButton && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Guided')}
                style={styles.headerButton}>
                <Image
                  source={require('../assets/icons/home.png')}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}>
              <Image
                source={require('../assets/icons/back_color.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>App Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.centerContainer}>
            <View style={styles.formContainer}>
              {/* Notification Settings */}
              <View style={styles.settingItem}>
                <View style={styles.switchContainer}>
                  <View style={styles.iconLabelContainer}>
                    <Image
                      source={require('../assets/icons/notification.png')}
                      style={styles.settingIcon}
                    />
                    <Text style={styles.settingLabel}>
                      Enable Notifications
                    </Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{false: '#767577', true: '#AA75CB'}}
                    thumbColor={notificationsEnabled ? '#f4f3f4' : '#f4f3f4'}
                  />
                </View>
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
                    onValueChange={handleSoundVolumeChange}
                    // Only update when sliding is complete to reduce flickering
                    onSlidingComplete={setSoundVolume}
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
                      volume > 0
                        ? require('../assets/icons/music.png')
                        : require('../assets/icons/music-off.png')
                    }
                    style={styles.settingIcon}
                  />
                  <Text style={styles.settingLabel}>
                    Background Music Volume
                  </Text>
                </View>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={volume}
                    onValueChange={handleMusicVolumeChange}
                    // Only update when sliding is complete to reduce flickering
                    onSlidingComplete={updateVolume}
                    minimumTrackTintColor="#AA75CB"
                    maximumTrackTintColor="#767577"
                    thumbTintColor="#f4f3f4"
                  />
                  <Text style={styles.volumeText}>
                    {Math.round(volume * 100)}%
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
  screenDimensions: {width: number; height: number},
) => {
  // Calculate responsive values based on screen dimensions
  const headerHeight = screenDimensions.height * 0.2;
  const headerIconSize = Math.max(40, screenDimensions.height * 0.08);
  const responsiveTitleSize = Math.min(26, screenDimensions.width * 0.03);
  const headerPadding = screenDimensions.width * 0.01;

  return StyleSheet.create({
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
      minHeight: screenDimensions.height,
    },
    headerIcon: {
      height: headerIconSize,
      width: headerIconSize,
      resizeMode: 'contain',
    },
    headerButton: {
      padding: 8, // Add padding to increase touchable area
      marginRight: headerPadding,
    },
    headerNavigation: {
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 2, // Ensure navigation buttons are above the title
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: headerPadding / 2,
      paddingHorizontal: headerPadding,
      height: headerHeight,
      position: 'relative',
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: screenDimensions.width * 0.03,
      paddingBottom: screenDimensions.height * 0.03,
    },
    formContainer: {
      width: formWidth,
      maxWidth: Math.min(500, screenDimensions.width * 0.7),
      backgroundColor: 'rgba(112, 109, 109, 0.57)',
      borderRadius: 12,
      padding: screenDimensions.width * 0.02,
      marginVertical: screenDimensions.height * 0.02,
    },
    title: {
      fontSize: responsiveTitleSize,
      fontWeight: 'bold',
      color: 'rgba(239, 141, 56, 0.78)',
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      zIndex: 1,
    },
    settingItem: {
      marginBottom: sectionSpacing,
      paddingVertical: screenDimensions.height * 0.015,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    iconLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: screenDimensions.height * 0.015,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingIcon: {
      width: Math.min(24, screenDimensions.width * 0.02),
      height: Math.min(24, screenDimensions.width * 0.02),
      marginRight: screenDimensions.width * 0.01,
      resizeMode: 'contain',
    },
    settingLabel: {
      fontSize: Math.max(fontSize, screenDimensions.width * 0.015),
      color: '#fff',
      fontWeight: '600',
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: screenDimensions.height * 0.015,
    },
    slider: {
      flex: 1,
      height: screenDimensions.height * 0.05,
      marginRight: screenDimensions.width * 0.01,
    },
    volumeText: {
      color: '#fff',
      width: screenDimensions.width * 0.05,
      textAlign: 'right',
      fontSize: Math.max(fontSize * 0.9, screenDimensions.width * 0.014),
    },
    button: {
      backgroundColor: '#AA75CB',
      height: Math.max(buttonHeight, screenDimensions.height * 0.08),
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: sectionSpacing,
    },
    feedbackButton: {
      backgroundColor: 'rgba(239, 141, 56, 0.78)',
      marginTop: screenDimensions.height * 0.02,
    },
    buttonText: {
      color: 'white',
      fontSize: Math.max(fontSize, screenDimensions.width * 0.016),
      fontWeight: 'bold',
    },
  });
};

export default SettingsScreen;
