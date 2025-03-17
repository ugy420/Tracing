import React from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Guided Screen"
        onPress={() => navigation.navigate('Guided')}
      />
      <Button
        title="Go to Tracing Screen"
        onPress={() => navigation.navigate('Tracing')}
      />
    </View>
  );
};

export default HomeScreen;
