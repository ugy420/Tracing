import {useNavigation, NavigationProp} from '@react-navigation/native';
import React from 'react';
import {
  // Image,
  Button,
  View,
  StyleSheet,
  ImageBackground,
  Text,
} from 'react-native';
import {RootStackParamList} from '../types';

const GuidedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kuzuzangpo Lhamo!</Text>
        <View style={styles.headerIcons}>
          {/* <Image source={require('../assets/icons/star.jpeg')} /> */}
        </View>
      </View>

      <View style={styles.container}>
        <Button
          title="Go to UnGuided Screen"
          onPress={() => navigation.navigate('UnGuided')}
        />
        <Button
          title="Go to Home Screen"
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          title="Go to Guided Category Screen"
          onPress={() => navigation.navigate('GuidedCategory')}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  header: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default GuidedScreen;
