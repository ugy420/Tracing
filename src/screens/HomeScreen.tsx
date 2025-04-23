import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/background_images/home_bg.png')}
      style={styles.background}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>SELECT MODE</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/icons/volume.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SettingScreen')}>
            <Image
              source={require('../assets/icons/setting_color.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.textBg}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.modeText}>Online</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textBg}>
          <TouchableOpacity onPress={() => navigation.navigate('Guided')}>
            <Text style={styles.modeText}>Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    position: 'absolute',
    top: 0,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Unlock-Bold',
    fontSize: 40,
    color: '#0B3936',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
  headerIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  container: {
    marginTop: '10%',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeText: {
    fontFamily: 'Unlock-Bold',
    fontSize: 40,
    color: '#082404',
    fontWeight: 'bold',
  },
  textBg: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    padding: 10,
    backgroundColor: '#2E6283',
    borderRadius: 30,
    margin: 10,
  },
});

export default HomeScreen;
