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
  image: any;
  subText: string;
  background: any;
  screen: keyof RootStackParamList;
};

const UnGuidedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const {width, height} = Dimensions.get('window');
  const isLandscape = width > height;
  const isSmallScreen = width < 375; // iPhone SE size

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
    <ImageBackground
      source={require('../assets/background_images/landing_bg.png')}
      style={styles.background}>
      <View style={styles.header}>
        {/* Background color layer */}
        <View style={styles.headerBackground} />

        {/* Avatar Container */}
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
              gender === 'male'
                ? require('../assets/icons/cropped_boy.png')
                : require('../assets/icons/girl.png')
            }
            style={styles.avatarImage}
          />
        </TouchableOpacity>

        {/* Header Text */}
        <Text
          style={[
            styles.headerText,
            isLandscape && styles.headerTextLandscape,
            isSmallScreen && styles.headerTextSmall,
          ]}>
          Kuzuzangpo, Lhamo!
        </Text>

        {/* Icons */}
        <View style={styles.headerIcons}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}>
              <Image
                source={require('../assets/icons/notification1.png')} // Add your notification icon PNG
                style={styles.icon}
              />
            </TouchableOpacity>
            </View>
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
              onPress={() => navigation.navigate('SettingScreen')}>
              <Image
                source={require('../assets/icons/setting.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
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
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#D9D9D9',
    opacity: 0.6,
    zIndex: -1,
  },
  headerText: {
    flex: 1,
    color: 'rgba(239, 141, 56, 0.78)',
    fontSize: 28,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 60,
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  headerTextLandscape: {
    fontSize: 24,
  },
  headerTextSmall: {
    fontSize: 22,
  },
  avatarContainer: {
    position: 'absolute',
    left: 15,
    top: '50%',
    marginTop: -30,
    width: 60,
    height: 60,
    zIndex: 2,
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
    zIndex: 2,
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
