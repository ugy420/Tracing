import {useNavigation, NavigationProp} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {RootStackParamList} from '../types';
import SharedLayout from '../components/SharedLayout';
import Orientation from 'react-native-orientation-locker';

type GridItem = {
  image: any;
  background: any;
  screen: keyof RootStackParamList;
  category: string;
};

const GuidedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {width, height} = Dimensions.get('window');
  const isLandscape = width > height;

  const gridItems: GridItem[] = [
    {
      image: require('../assets/alphabets/saljay.png'),
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
      category: 'alphabets',
    },
    {
      image: require('../assets/numbers/numbers.png'),
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
      category: 'numbers',
    },
    {
      image: require('../assets/alphabets/yaang.png'),
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
      category: 'vowels',
    },
  ];

  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  return (
    <SharedLayout>
      <View
        style={[styles.container, isLandscape && styles.landscapeContainer]}>
        <View style={[styles.grid, isLandscape && styles.landscapeGrid]}>
          {gridItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.gridItem]}
              onPress={() =>
                navigation.navigate(item.screen, {category: item.category})
              }>
              <ImageBackground
                source={item.background}
                style={styles.gridItemBackground}>
                <Image style={styles.gridItemImage} source={item.image} />
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('UnGuided')}>
          <Image
            source={require('../assets/icons/next.png')}
            style={styles.nextButtonIcon}
          />
        </TouchableOpacity>
      </View>
    </SharedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  landscapeContainer: {
    paddingTop: 5,
  },
  grid: {
    width: '35%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  landscapeGrid: {
    width: '50%',
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
    resizeMode: 'contain',
  },
  gridItemBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  nextButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  nextButtonIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default GuidedScreen;
