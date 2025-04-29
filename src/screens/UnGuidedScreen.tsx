import {useNavigation, NavigationProp} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {RootStackParamList} from '../types';
import SharedLayout from '../components/SharedLayout';

type GridItem = {
  image: any;
  background: any;
  screen: 'GuidedCategory';
};

const UnGuidedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const gridItems: GridItem[] = [
    {
      image: require('../assets/icons/animalIcon.png'),
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
    {
      image: require('../assets/icons/familyIcon.png'),
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
    {
      image: require('../assets/icons/weatherIcon.png'),
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
    // {
    //   image: require('../assets/icons/shapeIcon.png'),
    //   background: require('../assets/icons/brownBox.png'),
    //   screen: 'GuidedCategory',
    // },
    // {
    //   image: require('../assets/icons/clothingIcon.png'),
    //   background: require('../assets/icons/brownBox.png'),
    //   screen: 'GuidedCategory',
    // },
    // {
    //   image: require('../assets/icons/expressionIcon.png'),
    //   background: require('../assets/icons/brownBox.png'),
    //   screen: 'GuidedCategory',
    // },
    // {
    //   image: require('../assets/icons/sportsIcon.png'),
    //   subText: 'Subtext',
    //   background: require('../assets/icons/brownBox.png'),
    //   screen: 'GuidedCategory',
    // },
    // {
    //   image: require('../assets/icons/fruitsIcon.png'),
    //   subText: 'Subtext',
    //   background: require('../assets/icons/brownBox.png'),
    //   screen: 'GuidedCategory',
    // },
    // {
    //   image: require('../assets/icons/familyIcon.png'),
    //   subText: 'Subtext',
    //   background: require('../assets/icons/brownBox.png'),
    //   screen: 'GuidedCategory',
    // },
  ];

  return (
    <SharedLayout>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Guided')}>
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <View style={styles.grid}>
          {gridItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => navigation.navigate(item.screen)}>
              <ImageBackground
                source={item.background}
                style={styles.gridItemBackground}>
                <Image source={item.image} style={styles.gridItemImage} />
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
  grid: {
    width: '60%',
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
    width: 100,
    height: 70,
    resizeMode: 'contain',
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
