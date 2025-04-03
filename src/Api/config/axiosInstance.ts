import axios from 'axios';
import {Alert} from 'react-native';
import {RootStackParamList} from '../../types';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  timeout: 1000 * 60 * 5,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add interceptor to include the cookie in the request

axiosInstance.interceptors.request.use(
  async config => {
    if (
      config.url &&
      !config.url.includes('auth/user/login') &&
      !config.url.includes('auth/registeration')
    ) {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add interceptor to handle responses (token expiration)

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      if (
        error.config.url &&
        !error.config.url.includes('auth/user/login') &&
        !error.config.url.includes('auth/registeration')
      ) {
        console.log('Token expired or not authorized');
        Alert.alert('Session Expired', 'Please log in again.');
        await AsyncStorage.removeItem('access_token');
        const navigation = useNavigation<NavigationProp<RootStackParamList>>();
        navigation.navigate('Login');
      }
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
