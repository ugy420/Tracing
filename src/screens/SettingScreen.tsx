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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLanguage} from '../context/languageContext';

type LanguageType = 'Eng' | 'Dzo';

// Define translation key type
type TranslationKey =
  | 'title'
  | 'soundVolume'
  | 'musicVolume'
  | 'saveSettings'
  | 'giveFeedback'
  | 'saveSuccess'
  | 'saveMessage'
  | 'language';
// Define the type for a single language's translations
type TranslationsForLanguage = {
  [key in TranslationKey]: string;
};

// Define the type for all translations
type TranslationsType = {
  [key in LanguageType]: TranslationsForLanguage;
};
const SettingsScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [soundVolume, setSoundVolume] = useState(0.7);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isGuest, setIsGuest] = useState(false);

  // Use music context for global music control
  const {volume, updateVolume} = useMusic();

  // Refs to prevent flicker
  const soundVolumeRef = useRef(soundVolume);
  const musicVolumeRef = useRef(volume);

  // Lock to landscape on mount
  useEffect(() => {
    Orientation.lockToLandscape();

    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });

    const checkGuestMode = async () => {
      const idGuestValue = await AsyncStorage.getItem('is_guest');
      setIsGuest(idGuestValue === 'true');
    };

    checkGuestMode();

    return () => {
      subscription?.remove();
    };
  }, [navigation]);

  // Get language context
  const {language, setLanguage} = useLanguage();

  // Ensure language is typed correctly
  const currentLanguage: LanguageType = (language as LanguageType) || 'Eng';
  // Text translations based on selected language
  const translations = {
    Eng: {
      title: 'App Settings',
      language: 'Language',
      soundVolume: 'Sound Volume',
      musicVolume: 'Background Music Volume',
      saveSettings: 'SAVE SETTINGS',
      giveFeedback: 'GIVE FEEDBACK',
      saveSuccess: 'Success',
      saveMessage: 'Your settings have been saved!',
    },
    Dzo: {
      title: 'གཞི་བཙུགས་བཟོ་བཀོད།',
      language: 'སྐད་ཡིག',
      soundVolume: 'སྒྲ་གདངས་ཚད་གཞི།',
      musicVolume: 'རྒྱབ་ལྗོངས་རོལ་དབྱངས་ཚད་གཞི།',
      saveSettings: 'གཞི་བཙུགས་ཉར་བཞག',
      giveFeedback: 'བསམ་འཆར་བཤད།',
      saveSuccess: 'ལེགས་སྒྲུབ།',
      saveMessage: 'ཁྱོད་ཀྱི་གཞི་བཙུགས་ཚུ་ཉར་ཚགས་འབད་ཡི!',
    },
  };

  // Get text based on current language
  const getText = (key: TranslationKey): string => {
    return (
      (translations[currentLanguage] as TranslationsForLanguage)[key] ||
      translations['Eng'][key]
    );
  };

  // Responsive values based on screen dimensions
  const isSmallScreen = dimensions.height < 400;

  // Base font sizes - now different for each language
  const baseFontSize = isSmallScreen ? 14 : 16;
  // Dzongkha text should be larger than English
  const getFontSize = () => {
    return language === 'Dzo'
      ? baseFontSize * 1.25 // 25% larger for Dzongkha
      : baseFontSize;
  };

  const responsiveButtonHeight = isSmallScreen ? 40 : 50;
  const formWidth = Math.min(dimensions.width * 0.8, 500);

  // Title font size also adjusts based on language
  const baseTitleSize = isSmallScreen ? 18 : 22;
  const getTitleFontSize = () => {
    return language === 'Dzo'
      ? baseTitleSize * 1.25 // 25% larger for Dzongkha titles
      : baseTitleSize;
  };

  const sectionSpacing = isSmallScreen ? 15 : 20;

  // Handle language toggle switch
  const handleLanguageToggle = (value: boolean) => {
    setLanguage(value ? 'Dzo' : 'Eng');
  };

  const handleSaveSettings = () => {
    console.log('Settings saved:', {
      soundVolume,
      musicVolume: volume,
    });
    Alert.alert(getText('saveSuccess'), getText('saveMessage'));
  };

  const handleGiveFeedback = () => {
    navigation.navigate('FeedbackSection');
  };

  const styles = createStyles(
    getFontSize(),
    responsiveButtonHeight,
    formWidth,
    getTitleFontSize(),
    sectionSpacing,
    dimensions,
    language,
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
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}>
              <Image
                source={require('../assets/icons/back_color.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{getText('title')}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.centerContainer}>
            <View style={styles.formContainer}>
              {/* Language Toggle */}
              <View style={styles.settingItem}>
                <View style={styles.languageSettingContainer}>
                  <View style={styles.iconLabelContainer}>
                    
                    <Text style={styles.settingLabel}>{getText('language')}</Text>
                  </View>
                  <View style={styles.switchContainer}>
                    <Text style={styles.languageLabel}>Eng</Text>
                    <Switch
                      trackColor={{false: '#2E6283', true: '#5E2B97'}}
                      thumbColor={language === 'Dzo' ? '#FFD700' : '#FFFFFF'}
                      ios_backgroundColor="#2E6283"
                      onValueChange={handleLanguageToggle}
                      value={language === 'Dzo'}
                      style={styles.languageSwitch}
                    />
                    <Text style={styles.languageLabel}>རྫོང</Text>
                  </View>
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
                  <Text style={styles.settingLabel}>
                    {getText('soundVolume')}
                  </Text>
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
                    {getText('musicVolume')}
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
                <Text style={styles.buttonText}>{getText('saveSettings')}</Text>
              </TouchableOpacity>

              {/* Feedback Button */}
              {!isGuest && (
                <TouchableOpacity
                  style={[styles.button, styles.feedbackButton]}
                  onPress={handleGiveFeedback}>
                  <Text style={styles.buttonText}>
                    {getText('giveFeedback')}
                  </Text>
                </TouchableOpacity>
              )}
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
  language: string,
) => {
  // Calculate responsive values based on screen dimensions
  const headerHeight = screenDimensions.height * 0.2;
  const headerIconSize = Math.max(40, screenDimensions.height * 0.08);
  const responsiveTitleSize =
    language === 'Dzo'
      ? Math.min(44, screenDimensions.width * 0.05) // Larger for Dzongkha
      : Math.min(28, screenDimensions.width * 0.03); // Original size for English

  const headerPadding = screenDimensions.width * 0.01;

  // Calculate button text size based on language
  const buttonTextSize =
    language === 'Dzo'
      ? Math.max(fontSize * 2.2, screenDimensions.width * 0.05)
      : Math.max(fontSize, screenDimensions.width * 0.016);

  // Calculate volume text size based on language
  const volumeTextSize =
    language === 'Dzo'
      ? Math.max(fontSize * 0.95, screenDimensions.width * 0.015)
      : Math.max(fontSize * 0.9, screenDimensions.width * 0.014);
  // for label
  const labelTextSize =
    language === 'Dzo'
      ? Math.max(fontSize * 2.2, screenDimensions.width * 0.05)
      : Math.max(fontSize, screenDimensions.width * 0.016);

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
      fontFamily: language === 'Dzo' ? 'joyig' : undefined,
      fontSize: responsiveTitleSize,
      fontWeight: language === 'Dzo' ? 'normal' : 'bold',
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
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginRight: screenDimensions.width * 0.03,
    },
    settingIcon: {
      width: Math.min(24, screenDimensions.width * 0.03),
      height: Math.min(24, screenDimensions.width * 0.03),
      marginRight: screenDimensions.width * 0.01,
      resizeMode: 'contain',
    },
    settingLabel: {
      fontFamily: language === 'Dzo' ? 'joyig' : undefined,
      fontSize: labelTextSize, // This already has language-specific sizing applied
      color: '#fff',
      fontWeight: language === 'Dzo' ? 'normal' : '600',
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
      fontSize: volumeTextSize, // Language-specific volume text size
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
      fontFamily: language === 'Dzo' ? 'joyig' : undefined,
      color: 'white',
      fontSize: buttonTextSize, // Language-specific button text size
      fontWeight: language === 'Dzo' ? 'normal' : 'bold',
    },
    languageSettingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingBottom:10,
    },
    languageLabel: {
      fontSize: Math.min(16, screenDimensions.width * 0.018),
      color: 'white',
      fontWeight: 'bold',
      marginHorizontal: 10,
     
    },
    languageSwitch: {
      transform: [{scaleX: 1.2}, {scaleY: 1.2}],
    },
  });
};

export default SettingsScreen;