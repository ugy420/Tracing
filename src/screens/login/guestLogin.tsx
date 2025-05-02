import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../types';
import Orientation from 'react-native-orientation-locker';
import uuid from 'react-native-uuid';

const GuestLogin = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [username, setUsername] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Handle orientation changes
  useEffect(() => {
    Orientation.unlockAllOrientations();
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => {
      Orientation.lockToPortrait();
      subscription.remove();
    };
  }, []);

  const isLandscape = dimensions.width > dimensions.height;

  // Responsive values
  const responsiveFontSize = isLandscape ? 15 : 14;
  const responsiveInputHeight = isLandscape ? 45 : 40;
  const formWidth = isLandscape
    ? dimensions.width * 0.5 // Reduced from 0.7 to 0.5 for landscape
    : dimensions.width * 0.85;
  const titleFontSize = isLandscape ? 22 : 22;

  const styles = createStyles(
    isLandscape,
    responsiveFontSize,
    responsiveInputHeight,
    formWidth,
    titleFontSize,
  );

  const handleGuestLogin = async (): Promise<void> => {
    // Reset error state
    setError(null);

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!gender) {
      setError('Please select a gender.');
      return;
    }

    setLoading(true);

    try {
      // Generate a unique guest ID using uuid
      const guestId = uuid.v4().toString();

      // Store data in AsyncStorage
      await AsyncStorage.setItem('guest_id', guestId);
      await AsyncStorage.setItem('is_guest', 'true');
      await AsyncStorage.setItem('guest_username', username.trim());
      await AsyncStorage.setItem('guest_gender', gender);
      await AsyncStorage.setItem('guest_starCount', '0');

      // Navigate to the Guided screen
      navigation.navigate('Guided');
    } catch (err: any) {
      console.log('Error during guest login:', err);
      setError('An unexpected error occurred.');
      Alert.alert('Error', 'Failed to log in as a guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background_images/home_bg.png')}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={isLandscape ? 30 : 0}
        style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.formBox}>
              <Text style={styles.title}>Guest Login</Text>

              {/* Error Message */}
              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              {/* Gender Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'Male' && styles.selectedGender,
                    ]}
                    onPress={() => setGender('Male')}>
                    <Text
                      style={[
                        styles.genderText,
                        gender === 'Male' && styles.selectedGenderText,
                      ]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'Female' && styles.selectedGender,
                    ]}
                    onPress={() => setGender('Female')}>
                    <Text
                      style={[
                        styles.genderText,
                        gender === 'Female' && styles.selectedGenderText,
                      ]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleGuestLogin}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>CONTINUE AS GUEST</Text>
                )}
              </TouchableOpacity>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// Styles definition
const createStyles = (
  isLandscape: boolean,
  fontSize: number,
  inputHeight: number,
  formWidth: number,
  titleFontSize: number,
) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(184, 184, 184, 0.12)',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: isLandscape ? 10 : 16,
    },
    formBox: {
      width: formWidth,
      maxWidth: isLandscape ? 340 : 380, // Smaller max width in landscape
      backgroundColor: 'rgba(255, 255, 255, 0.64)',
      borderRadius: 12,
      padding: isLandscape ? 16 : 20, // Less padding in landscape
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    title: {
      fontSize: titleFontSize,
      fontWeight: 'bold',
      marginBottom: isLandscape ? 15 : 20,
      color: '#333',
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: isLandscape ? 12 : 16,
    },
    label: {
      fontSize: fontSize,
      marginBottom: 6,
      color: '#333',
      fontWeight: '500',
    },
    input: {
      height: inputHeight,
      borderWidth: 1,
      borderColor: '#AA75CB',
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    genderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    genderButton: {
      flex: 1,
      height: inputHeight,
      borderWidth: 1,
      borderColor: '#AA75CB',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    selectedGender: {
      backgroundColor: '#AA75CB',
    },
    genderText: {
      color: '#333',
      fontSize: fontSize,
    },
    selectedGenderText: {
      color: 'white',
    },
    button: {
      backgroundColor: '#AA75CB',
      height: 42,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: 'white',
      fontSize: fontSize,
      fontWeight: 'bold',
    },
    secondaryButton: {
      height: inputHeight,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginBottom: 10,
    },
  });

export default GuestLogin;
