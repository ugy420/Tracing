import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { RootStackParamList } from '../types';
import SharedLayout from '../components/SharedLayout';

type GridItem = {
  image: any;
  subText: string;
  background: any;
  screen: keyof RootStackParamList;
};

const UnGuidedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  const gridItems: GridItem[] = [
    {
      image: require('../assets/icons/animalIcon.png'),
      subText: 'Subtext',
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
    {
      image: require('../assets/icons/familyIcon.png'),
      subText: 'Subtext',
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
    {
      image: require('../assets/icons/weatherIcon.png'),
      subText: 'Subtext',
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
  ];

  return (
    <SharedLayout headerTitle="Kuzuzangpo, Lhamo!">
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Guided')}>
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <View style={[styles.grid, isLandscape && styles.landscapeGrid]}>
          {gridItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => navigation.navigate(item.screen)}>
              <ImageBackground
                source={item.background}
                style={styles.gridItemBackground}>
                <Image source={item.image} style={styles.gridItemImage} />
                <Text style={styles.gridItemSubText}>{item.subText}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SharedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'row',
  },
  landscapeGrid: {
    width: '50%',
  },
  grid: {
    width: '35%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: '28%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  gridItemBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  gridItemSubText: {
    fontSize: 16,
    color: 'white',
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  backButtonIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default UnGuidedScreen;