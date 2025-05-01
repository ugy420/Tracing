import React, {ReactNode, useState, useEffect} from 'react';
import {
  Image,
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatarImages from '../assets/avatarImages';

type SharedLayoutProps = {
  children: ReactNode;
};

const SharedLayout = ({children}: SharedLayoutProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [gender, setGender] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const {width, height} = Dimensions.get('window');
  const isLandscape = width > height;
  const isSmallScreen = width < 375; // iPhone SE size
  const [currentAvatarBorder, setCurrentAvatarBorder] = useState<
    keyof typeof avatarImages | null
  >(null);
  const [starCount, setStarCount] = useState<string | null>(null);

  const clearModeData = async (mode: 'online') => {
    if (mode === 'online') {
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('gender');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('avatar_borders');
      await AsyncStorage.removeItem('current_avatar_border');
      await AsyncStorage.removeItem('starCount');
    }
  };

  const getUserData = async () => {
    try {
      const isGuest = await AsyncStorage.getItem('is_guest');
      if (isGuest === 'true') {
        // Clear online async data
        await clearModeData('online');
        const guestId = await AsyncStorage.getItem('guest_id');
        if (!guestId) {
          navigation.navigate('GuestLogin');
          return;
        }
      }

      const get_gender = await AsyncStorage.getItem('gender');
      setGender(get_gender);

      const get_username = await AsyncStorage.getItem('username');
      const get_guest_username = await AsyncStorage.getItem('guest_username');
      if (!get_username) {
        setUsername(get_guest_username);
      } else {
        setUsername(get_username);
      }

      const get_avatar_border = await AsyncStorage.getItem(
        'current_avatar_border',
      );
      const get_guest_avatar_border = await AsyncStorage.getItem(
        'guest_current_avatar_border',
      );

      if (get_avatar_border) {
        const avatarKey = `avatar${get_avatar_border}`; // Map number to avatar key
        setCurrentAvatarBorder(
          avatarKey in avatarImages
            ? (avatarKey as keyof typeof avatarImages)
            : null,
        );
      } else {
        const avatarKey = `avatar${get_guest_avatar_border}`;
        setCurrentAvatarBorder(
          avatarKey in avatarImages
            ? (avatarKey as keyof typeof avatarImages)
            : null,
        );
      }

      const getStarCount = await AsyncStorage.getItem('starCount');
      setStarCount(getStarCount);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/background_images/landing_bg.png')}
      style={styles.background}>
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        {/* Avatar Container - Now on the left */}
        <TouchableOpacity
          style={[
            styles.avatarContainer,
            isLandscape && styles.avatarContainerLandscape,
            isSmallScreen && styles.avatarContainerSmall,
          ]}
          onPress={() => navigation.navigate('Avatar')}>
          <Image
            source={
              currentAvatarBorder
                ? avatarImages[currentAvatarBorder]
                : require('../assets/avatarImages/a7.png')
            }
            style={styles.avatarBorder}
            onError={error =>
              console.error(
                'Error loading avatar border:',
                error.nativeEvent.error,
              )
            }
          />
          <Image
            source={
              gender === 'Male'
                ? require('../assets/icons/cropped_boy.png')
                : require('../assets/icons/cropped_girl.png')
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
          Kuzuzangpo, {username}!
        </Text>

        <View style={styles.starCounterContainer}>
          <Image
            source={require('../assets/icons/star.png')}
            style={styles.starIcon}
          />
          <View style={styles.starCountBox}>
            <Text style={styles.starCountText}>{starCount}</Text>
          </View>
        </View>

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
              onPress={() => navigation.navigate('SettingScreen')}>
              <Image
                source={require('../assets/icons/setting.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content area */}
      {children}
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
    fontFamily: 'Arial',
    fontWeight: 'bold',
    textAlign: 'left',
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
  // Star counter styles
  starCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    zIndex: 2,
  },
  starIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 5,
  },
  starCountBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#2682F4',
  },
  starCountText: {
    color: '#FF8C00',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
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
});

export default SharedLayout;
