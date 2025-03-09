import React from 'react';

// Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';

// Screens
import HomeScreen from './screens/HomeScreen';
import GuidedScreen from './screens/GuidedScreen';
import UnGuidedScreen from './screens/UnGuidedScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Guided" component={GuidedScreen} />
        <Stack.Screen name="UnGuided" component={UnGuidedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
