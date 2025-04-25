import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  GestureResponderEvent,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlexStyle,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import {useOrientation} from './useOrientation';

const LoginScreen = () => {
  const orientation = useOrientation('login');
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get('window'),
  );
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Update dimensions when screen size changes
  useEffect(() => {
    const updateDimensions = () => {
      setScreenDimensions(Dimensions.get('window'));
    };

    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions,
    );

    return () => subscription.remove();
  }, []);

  const isLandscape = screenDimensions.width > screenDimensions.height;

  const handleLogin = (event: GestureResponderEvent): void => {
    event.preventDefault();
    console.log('Logging in with:', {username, password});
    // Handle login logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Dynamic styles based on orientation
  const dynamicStyles = {
    formBox: {
      width: isLandscape
        ? screenDimensions.width * 0.5
        : screenDimensions.width * 0.8,
      maxWidth: isLandscape ? 500 : 380,
    },
    contentContainer: {
      paddingHorizontal: isLandscape ? 40 : 16,
      flexDirection: isLandscape
        ? 'row'
        : ('column' as FlexStyle['flexDirection']),
      justifyContent: 'center' as FlexStyle['justifyContent'],
      alignItems: 'center' as FlexStyle['alignItems'],
    },
  };

  return (
    <ImageBackground
      source={require('../../assets/background_images/home_bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled">
            <View
              style={[styles.contentContainer, dynamicStyles.contentContainer]}>
              <View style={[styles.formBox, dynamicStyles.formBox]}>
                <Text style={styles.title}>Login</Text>

                <View style={styles.inputContainer}>
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
                  <View style={styles.passwordFieldContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={(text: string) => setPassword(text)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.showHideButton}
                      onPress={togglePasswordVisibility}>
                      <Text style={styles.showHideText}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>LOGIN</Text>
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

// Styles definition
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(184, 184, 184, 0.12)',
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formBox: {
    justifyContent: 'center',
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordFieldContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#AA75CB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 50, // Make space for the Show/Hide button
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  showHideButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  showHideText: {
    color: '#AA75CB',
    fontSize: 12,
    fontWeight: '500',
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 42,
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondaryButton: {
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#AA75CB',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default LoginScreen;
