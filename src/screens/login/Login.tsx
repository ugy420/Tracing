import React, {useState} from 'react';
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
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../types';
import {useOrientation} from './useOrientation';
import axiosInstance from '../../Api/config/axiosInstance';
import api from '../../Api/endPoints';

const {width} = Dimensions.get('window');

const LoginScreen = () => {
  useOrientation('login');

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    // console.log('Attempting login with:', {username, password});

    try {
      const response = await axiosInstance.post(api.user.loginUser, {
        username: username.trim(),
        password: password.trim(),
      });
      const token = response.data.access_token;
      const user_id = response.data.user.id.toString();
      const gender = response.data.user.gender;
      const getusername = response.data.user.username;
      const getCurrentAvatar =
        response.data.user.current_avatar_border_id.toString();

      // Store the token and user id in AsyncStorage
      await AsyncStorage.setItem('access_token', token);
      await AsyncStorage.setItem('user_id', user_id);
      await AsyncStorage.setItem('gender', gender);
      await AsyncStorage.setItem('username', getusername);
      await AsyncStorage.setItem('current_avatar_border', getCurrentAvatar);

      console.log('User response from API:', response.data);
      navigation.navigate('Guided');
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Invalid username or password');
        console.log('Error Response:', err.response.data);
      } else if (err.request) {
        console.log('No Response Received:', err.request);
      } else {
        console.log('Error Message:', err.message);
      }
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background_images/home_bg.png')}
      style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.formBox}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputContainer}>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={(text: string) => setUsername(text)}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text: string) => setPassword(text)}
                secureTextEntry
              />
            </View>

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
    </ImageBackground>
  );
};

// Styles definition
const styles = StyleSheet.create({
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
    padding: 16, // Reduced from 20
  },
  formBox: {
    width: width * 0.8, // Reduced from 0.85
    maxWidth: 380, // Reduced from 400
    backgroundColor: 'rgba(255, 255, 255, 0.64)',
    borderRadius: 12,
    padding: 20, // Reduced from 25
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22, // Reduced from 24
    fontWeight: 'bold',
    marginBottom: 20, // Reduced from 25
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16, // Reduced from 20
  },
  label: {
    fontSize: 13, // Reduced from 14
    marginBottom: 6, // Reduced from 8
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 42, // Reduced from 45
    borderWidth: 1,
    borderColor: '#AA75CB',
    borderRadius: 8,
    paddingHorizontal: 12, // Reduced from 15
    fontSize: 14, // Reduced from 15
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  button: {
    backgroundColor: '#AA75CB',
    height: 42, // Reduced from 45
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16, // Reduced from 20
  },
  buttonText: {
    color: 'white',
    fontSize: 15, // Reduced from 16
    fontWeight: 'bold',
  },
  secondaryButton: {
    height: 42, // Reduced from 45
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12, // Reduced from 15
  },
  secondaryButtonText: {
    color: '#AA75CB',
    fontSize: 13, // Reduced from 14
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default LoginScreen;
