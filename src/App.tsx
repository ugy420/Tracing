import React from 'react';
import {useEffect} from 'react';
import Orientation from 'react-native-orientation-locker';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {MusicProvider} from './components/MusicContext';

// Screens
import HomeScreen from './screens/HomeScreen';
import GuidedScreen from './screens/GuidedScreen';
import UnGuidedScreen from './screens/UnGuidedScreen';
import GuidedCategory from './screens/GuidedCategoryScreen';
import AvatarScreen from './screens/AvatarScreen';
import Tracing from './screens/Tracing';
import AchievementScreen from './screens/AchievementScreen';
import CompletionScreen from './screens/CompletionScreen';
import LoginScreen from './screens/login/Login';
import SignUpScreen from './screens/login/SignUp';
import FeedbackSection from './screens/FeedbackSection';
import SettingScreen from './screens/SettingScreen';
import QuizScreen from './screens/QuizSection';
import GuestLogin from './screens/login/guestLogin';
import QuizHomeScreen from './screens/QuizHomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  useEffect(() => {
    // Initialize with landscape locked
    Orientation.lockToLandscape();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <MusicProvider backgroundTrack='dummy_music'>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Guided"
            component={GuidedScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UnGuided"
            component={UnGuidedScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="GuidedCategory"
            component={GuidedCategory}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Avatar"
            component={AvatarScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Tracing"
            component={Tracing}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Achievement"
            component={AchievementScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CompletionScreen"
            component={CompletionScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="FeedbackSection"
            component={FeedbackSection}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SettingScreen"
            component={SettingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="QuizScreen"
            component={QuizScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="GuestLogin"
            component={GuestLogin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="QuizHomeScreen"
            component={QuizHomeScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MusicProvider>
  );
};

export default App;
