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
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../types';
import axiosInstance from '../../Api/config/axiosInstance';
import api from '../../Api/endPoints';
import Orientation from 'react-native-orientation-locker';

const LoginScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
  const responsiveFontSize = isLandscape ? 16 : 14;
  const responsiveInputHeight = isLandscape ? 50 : 40;
  const formWidth = isLandscape
    ? dimensions.width * 0.7
    : dimensions.width * 0.85;
  const titleFontSize = isLandscape ? 24 : 22;

  const styles = createStyles(
    isLandscape,
    responsiveFontSize,
    responsiveInputHeight,
    formWidth,
    titleFontSize,
  );

  const handleLogin = async (): Promise<void> => {
    // Reset error state
    setError(null);

    // Validate input
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(api.user.loginUser, {
        username: username.trim(),
        password: password.trim(),
      });
      // console.log('Login Response:', response.data);

      // Extract data from response
      const token = response.data.access_token;
      const user_id = response.data.user.id.toString();
      const gender = response.data.user.gender;
      const getusername = response.data.user.username;
      const getCurrentAvatar =
        response.data.user.current_avatar_border_id?.toString() || '7';
      const getUserStar = response.data.user.starCount;

      // Store data in AsyncStorage
      await AsyncStorage.setItem('access_token', token);
      await AsyncStorage.setItem('user_id', user_id);
      await AsyncStorage.setItem('gender', gender);
      await AsyncStorage.setItem('username', getusername);
      await AsyncStorage.setItem('current_avatar_border', getCurrentAvatar);
      await AsyncStorage.setItem('starCount', getUserStar.toString());

      // Navigate to the Guided screen
      navigation.navigate('Guided');
    } catch (err: any) {
      // Handle errors
      if (err.response) {
        setError(err.response.data.message || 'Invalid username or password');
        console.log('Error Response:', err.response.data);
      } else if (err.request) {
        console.log('No Response Received:', err.request);
        setError('No response from server. Please check your network.');
      } else {
        console.log('Error Message:', err.message);
        setError('An unexpected error occurred.');
      }
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
        keyboardVerticalOffset={isLandscape ? 50 : 0}
        style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.formBox}>
              <Text style={styles.title}>Login</Text>

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

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>LOGIN</Text>
                )}
              </TouchableOpacity>

              {/* Sign Up Link */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.secondaryButtonText}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
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
      padding: 16,
    },
    formBox: {
      width: formWidth,
      maxWidth: 380,
      backgroundColor: 'rgba(255, 255, 255, 0.64)',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    title: {
      fontSize: titleFontSize,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 16,
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
    secondaryButtonText: {
      color: '#AA75CB',
      fontSize: fontSize,
      fontWeight: '500',
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginBottom: 10,
    },
  });

export default LoginScreen;
