import React from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';

const UnGuidedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View>
      <Text>UnGuided Screen</Text>
      <Button
        title="Go to Guided Screen"
        onPress={() => navigation.navigate('Guided')}
      />
    </View>
  );
};

export default UnGuidedScreen;
