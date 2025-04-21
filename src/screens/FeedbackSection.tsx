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

  // Handle orientation changes
  useEffect(() => {
    Orientation.unlockAllOrientations();
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => {
      Orientation.lockToLandscape();
      subscription.remove();
    };
  }, []);

  const isLandscape = dimensions.width > dimensions.height;

  // Responsive values
  const responsiveFontSize = isLandscape ? 16 : 14;
  const responsiveInputHeight = isLandscape ? 50 : 40;
  const formWidth = isLandscape
    ? dimensions.width * 0.6
    : dimensions.width * 0.9;
  const titleFontSize = isLandscape ? 22 : 20;
  const feedbackInputHeight = isLandscape
    ? dimensions.height * 0.3
    : dimensions.height * 0.2;

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
    isLandscape,
    responsiveFontSize,
    responsiveInputHeight,
    formWidth,
    titleFontSize,
    feedbackInputHeight,
  );

  return (
    <ImageBackground
      source={require('../assets/background_images/home_bg.png')}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.headerLeft}>
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
          </View>
          <View style={styles.centerContainer}>
            <Text style={styles.title}>We Value Your Feedback</Text>

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
  isLandscape: boolean,
  fontSize: number,
  inputHeight: number,
  formWidth: number,
  titleFontSize: number,
  feedbackInputHeight: number,
) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(183, 179, 179, 0.17)',
      justifyContent: 'center',
    },
    headerIcon: {
      height: 40,
      width: 40,
      resizeMode: 'contain',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    centerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    formContainer: {
      width: formWidth,
      maxWidth: 500,
      backgroundColor: 'rgba(112, 109, 109, 0.57)',
      borderRadius: 12,
      padding: 20,
    },
    title: {
      fontSize: titleFontSize,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#fff',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
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

export default FeedbackSection;
