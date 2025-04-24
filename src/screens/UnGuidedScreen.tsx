import {useNavigation, NavigationProp} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from '../types';

type GridItem = {
  image: any;
  background: any;
  screen: keyof RootStackParamList;
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
    {
      image: require('../assets/icons/shapeIcon.png'),
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
    {
      image: require('../assets/icons/clothingIcon.png'),
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
    {
      image: require('../assets/icons/expressionIcon.png'),
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
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
    <ImageBackground
      source={require('../assets/background_images/landing_bg.png')}
      style={styles.background}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kuzuzangpo, Lhamo!</Text>
        <View style={styles.headerIcons}>
          {/* <View style={styles.starCount}>
            <View style={styles.outerRectangle}>
              <View style={styles.innerRectangle}>
                <Image
                  source={require('../assets/icons/star.png')}
                  style={styles.halfstar}
                />
                <Text style={styles.scoreText}>500</Text>
              </View>
            </View>
          </View> */}

          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/icons/award.png')}
              style={styles.icon}
            />
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/icons/setting.png')}
              style={styles.icon}
            />
          </View>
        </View>
      </View>

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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#D9D9D9',
    opacity: 0.6,
  },
  headerText: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#2682F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 3,
  },
  // starCount: {
  //   position: 'relative',
  // },
  // outerRectangle: {
  //   width: '100%',
  //   height: 30,
  //   borderRadius: 20,
  //   backgroundColor: '#7E96E4',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // scoreText: {
  //   color: 'white',
  //   fontSize: 24,
  //   fontWeight: 'bold',
  // },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'row',
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
