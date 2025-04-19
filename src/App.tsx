import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';

// Screens
import HomeScreen from './screens/HomeScreen';
import GuidedScreen from './screens/GuidedScreen';
import UnGuidedScreen from './screens/UnGuidedScreen';
import GuidedCategory from './screens/GuidedCategoryScreen';
import AvatarScreen from './screens/AvatarScreen';
import Tracing from './screens/Tracing';
import AchievementScreen from './screens/AchievementScreen';
import CompletionScreen from './screens/CompletionScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
  <NavigationContainer>
    <Stack.Navigator initialRouteName="GuidedCategory">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Guided"
        component={GuidedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UnGuided"
        component={UnGuidedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GuidedCategory"
        component={GuidedCategory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Avatar"
        component={AvatarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tracing"
        component={Tracing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Achievement"
        component={AchievementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompletionScreen"
        component={CompletionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
</GestureHandlerRootView>
  );
};

export default App;
