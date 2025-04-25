import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import Orientation from 'react-native-orientation-locker';

const FeedbackSection = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [feedback, setFeedback] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Lock to landscape orientation only
  useEffect(() => {
    // Force landscape orientation
    Orientation.lockToLandscape();
    
    // Update dimensions when screen size changes (e.g., different devices)
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);

  // Responsive values based on screen size
  const fontSize = Math.max(16, dimensions.width * 0.015);
  const inputHeight = Math.max(50, dimensions.height * 0.08);
  const formWidth = dimensions.width * 0.6;
  const titleFontSize = Math.min(26, dimensions.width * 0.03);
  const feedbackInputHeight = dimensions.height * 0.3;

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }

    console.log('Submitting feedback:', {feedback});
    Alert.alert('Thank You', 'Your feedback has been submitted!');
    setFeedback('');
  };

  const styles = createStyles(
    fontSize,
    inputHeight,
    formWidth,
    titleFontSize,
    feedbackInputHeight,
    dimensions,
  );

  return (
    <ImageBackground
      source={require('../assets/background_images/home_bg.png')}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerNavigation}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Home')}
                style={styles.headerButton}
              >
                <Image
                  source={require('../assets/icons/home.png')}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
              >
                <Image
                  source={require('../assets/icons/back_color.png')}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>We Value Your Feedback</Text>
          </View>

          <View style={styles.centerContainer}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Your Feedback*</Text>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Share your thoughts with us..."
                  placeholderTextColor="#999"
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={5}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmitFeedback}>
                <Text style={styles.buttonText}>SUBMIT FEEDBACK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const createStyles = (
  fontSize: number,
  inputHeight: number,
  formWidth: number,
  titleFontSize: number,
  feedbackInputHeight: number,
  screenDimensions: { width: number, height: number },
) => {
  // Calculate responsive values based on screen dimensions
  const headerHeight = screenDimensions.height * 0.2;
  const headerIconSize = Math.max(40, screenDimensions.height * 0.08);
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
      paddingHorizontal: 20,
    },
    formContainer: {
      width: formWidth,
      maxWidth: Math.min(500, screenDimensions.width * 0.7),
      backgroundColor: 'rgba(112, 109, 109, 0.57)',
      borderRadius: 12,
      padding: 20,
    },
    title: {
      fontSize: titleFontSize,
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
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: fontSize,
      marginBottom: 8,
      color: '#333',
      fontWeight: '600',
    },
    feedbackInput: {
      height: feedbackInputHeight,
      borderWidth: 1,
      borderColor: '#AA75CB',
      borderRadius: 8,
      padding: 12,
      fontSize: fontSize,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: '#AA75CB',
      height: inputHeight,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    buttonText: {
      color: 'white',
      fontSize: fontSize + 2,
      fontWeight: 'bold',
    },
  });
};

export default FeedbackSection;