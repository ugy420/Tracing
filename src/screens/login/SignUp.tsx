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
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import Orientation from 'react-native-orientation-locker';

const SignUpScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
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

  const handleSignUp = (event: GestureResponderEvent): void => {
    event.preventDefault();
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match!");
      return;
    }
    console.log('Signing up with:', {username, password, dateOfBirth, gender});
    navigation.navigate('Login');
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const styles = createStyles(
    isLandscape,
    responsiveFontSize,
    responsiveInputHeight,
    formWidth,
    titleFontSize,
  );

  return (
    <ImageBackground
      source={require('../../assets/background_images/home_bg.png')}
      style={styles.backgroundImage}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={isLandscape ? 50 : 0}
        style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.mainContentContainer}>
              <View style={styles.formBox}>
                <Text style={styles.title}>Create Your Account</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={(text: string) => setUsername(text)}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, {flex: 1}]}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={(text: string) => setPassword(text)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.showHideButton}
                      onPress={() => setShowPassword(!showPassword)}>
                      <Text style={styles.showHideText}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, {flex: 1}]}
                      placeholder="Confirm your password"
                      placeholderTextColor="#999"
                      value={confirmPassword}
                      onChangeText={(text: string) => setConfirmPassword(text)}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.showHideButton}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }>
                      <Text style={styles.showHideText}>
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={{color: '#000', fontSize: responsiveFontSize}}>
                      {formatDate(dateOfBirth)}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dateOfBirth}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onChangeDate}
                      maximumDate={new Date()}
                    />
                  )}
                </View>

                <View style={styles.genderContainer}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.radioGroup}>
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => setGender('male')}>
                      <View style={styles.radioCircle}>
                        {gender === 'male' && (
                          <View style={styles.selectedRb} />
                        )}
                      </View>
                      <Text style={styles.radioText}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => setGender('female')}>
                      <View style={styles.radioCircle}>
                        {gender === 'female' && (
                          <View style={styles.selectedRb} />
                        )}
                      </View>
                      <Text style={styles.radioText}>Female</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.secondaryButtonText}>
                    Already have an account? Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: isLandscape ? 10 : 20,
    },
    mainContentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: '5%',
    },
    formBox: {
      width: formWidth,
      maxWidth: 500,
      backgroundColor: 'rgba(255, 255, 255, 0.64)',
      borderRadius: 16,
      padding: 25,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    title: {
      fontSize: titleFontSize,
      fontWeight: 'bold',
      marginBottom: isLandscape ? 15 : 25,
      color: '#333',
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: isLandscape ? 10 : 15,
    },
    label: {
      fontSize: fontSize,
      marginBottom: 5,
      color: '#333',
      fontWeight: '500',
    },
    input: {
      height: inputHeight,
      borderWidth: 1,
      borderColor: '#AA75CB',
      borderRadius: 6,
      paddingHorizontal: 12,
      fontSize: fontSize,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      justifyContent: 'center',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    showHideButton: {
      position: 'absolute',
      right: 10,
      padding: 8,
    },
    showHideText: {
      color: '#AA75CB',
      fontSize: 12,
    },
    genderContainer: {
      marginBottom: isLandscape ? 10 : 15,
    },
    radioGroup: {
      flexDirection: 'row',
      marginTop: 5,
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#AA75CB',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
    },
    selectedRb: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#AA75CB',
    },
    radioText: {
      fontSize: fontSize,
      color: '#333',
    },
    button: {
      backgroundColor: '#AA75CB',
      height: isLandscape ? 50 : 42,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: isLandscape ? 15 : 20,
    },
    buttonText: {
      color: 'white',
      fontSize: isLandscape ? 16 : 16,
      fontWeight: 'bold',
    },
    secondaryButton: {
      height: isLandscape ? 50 : 42,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: isLandscape ? 10 : 15,
      marginBottom: isLandscape ? 10 : 20,
    },
    secondaryButtonText: {
      color: '#AA75CB',
      fontSize: fontSize,
      fontWeight: '500',
    },
  });

export default SignUpScreen;