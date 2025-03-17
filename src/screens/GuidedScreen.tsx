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
  text: string;
  subText: string;
  background: any;
  screen: keyof RootStackParamList;
};

const GuidedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const gridItems: GridItem[] = [
    {
      text: 'ཀ',
      subText: 'Subtext',
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
    {
      text: 'ཁ',
      subText: 'Subtext',
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
    {
      text: 'ག',
      subText: 'Subtext',
      background: require('../assets/icons/blueBox.png'),
      screen: 'GuidedCategory',
    },
    {
      text: 'ང',
      subText: 'Subtext',
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
    {
      text: 'ཅ',
      subText: 'Subtext',
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
    {
      text: 'ཆ',
      subText: 'Subtext',
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
    {
      text: 'ཇ',
      subText: 'Subtext',
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
    {
      text: 'ཉ',
      subText: 'Subtext',
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
    {
      text: 'ཏ',
      subText: 'Subtext',
      background: require('../assets/icons/brownBox.png'),
      screen: 'GuidedCategory',
    },
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
        <View style={styles.grid}>
          {gridItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => navigation.navigate(item.screen)}>
              <ImageBackground
                source={item.background}
                style={styles.gridItemBackground}>
                <Text style={styles.gridItemText}>{item.text}</Text>
                <Text style={styles.gridItemSubText}>{item.subText}</Text>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
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
  gridItemText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  gridItemSubText: {
    fontSize: 16,
    color: 'white',
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
