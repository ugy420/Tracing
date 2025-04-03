import {useNavigation, NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
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
  const [gender] = useState<'Male' | 'Female'>('Male');
  const {width, height} = Dimensions.get('window');
  const isLandscape = width > height;
  const isSmallScreen = width < 375; // iPhone SE size

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
        {/* Avatar Container - Now on the left */}
        <TouchableOpacity
          style={[
            styles.avatarContainer,
            isLandscape && styles.avatarContainerLandscape,
            isSmallScreen && styles.avatarContainerSmall,
          ]}
          onPress={() => navigation.navigate('Avatar')}>
          <Image
            source={require('../assets/avatarImages/a7.png')}
            style={styles.avatarBorder}
          />
          <Image
            source={
              gender === 'Male'
                ? require('../assets/icons/cropped_boy.png')
                : require('../assets/icons/girl.png')
            }
            style={styles.avatarImage}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerText,
            isLandscape && styles.headerTextLandscape,
            isSmallScreen && styles.headerTextSmall,
          ]}>
          Kuzuzangpo, Lhamo!
        </Text>

        <View style={styles.headerIcons}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Achievement')}>
              <Image
                source={require('../assets/icons/award.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FeedbackSection')}>
              <Image
                source={require('../assets/icons/setting.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={[styles.container, isLandscape && styles.landscapeContainer]}>
        <View style={[styles.grid, isLandscape && styles.landscapeGrid]}>
          {gridItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.gridItem, isLandscape && styles.landscapeGridItem]}
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
    paddingHorizontal: 15,
    backgroundColor: '#D9D9D9',
    opacity: 0.6,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontSize: 28,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 60, // Make space for avatar
  },
  headerTextLandscape: {
    fontSize: 24,
  },
  headerTextSmall: {
    fontSize: 22,
  },
  // Avatar Styles
  avatarContainer: {
    position: 'absolute',
    left: 15,
    top: '50%',
    marginTop: -30, // Half of height to center vertically
    width: 60,
    height: 60,
    zIndex: 10,
  },
  avatarContainerLandscape: {
    width: 50,
    height: 50,
    marginTop: -25,
  },
  avatarContainerSmall: {
    width: 50,
    height: 50,
    marginTop: -25,
  },
  avatarBorder: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'contain',
  },
  avatarImage: {
    width: '70%',
    height: '70%',
    position: 'absolute',
    top: '15%',
    left: '15%',
    resizeMode: 'contain',
    borderRadius: 30,
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
  },
  landscapeGridItem: {
    width: '18%',
    margin: '1%',
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
