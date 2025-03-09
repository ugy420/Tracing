import {useNavigation, NavigationProp} from '@react-navigation/native';
import React from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import {RootStackParamList} from '../types';

const GuidedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <Text>Guided Screen</Text>
      <Button
        title="Go to UnGuided Screen"
        onPress={() => navigation.navigate('UnGuided')}
      />
      <Button
        title="Go to Home Screen"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GuidedScreen;
