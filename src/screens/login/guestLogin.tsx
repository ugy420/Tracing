import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types';

const GuestLogin = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');

  const handleGuestLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username to continue.');
      return;
    }

    try {
      // Generate a unique guest ID
      const guestId = uuid.v4().toString();

      // Store guest data in AsyncStorage
      await AsyncStorage.setItem('guest_id', guestId);
      await AsyncStorage.setItem('is_guest', 'true');
      await AsyncStorage.setItem('guest_username', username);
      // await AsyncStorage.setItem('guestStar', '0');

      // Navigate to the Guided screen
      navigation.navigate('Guided');
    } catch (error) {
      console.error('Error during guest login:', error);
      Alert.alert('Error', 'Failed to log in as a guest. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleGuestLogin}>
        <Text style={styles.buttonText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2682F4',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GuestLogin;
