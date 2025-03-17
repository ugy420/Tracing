import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
// import AvatarSvg from '../assets/icons/avatar.svg';

const {width, height} = Dimensions.get('window');

const AvatarScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.container}>
        {/* <Text style={styles.headerText}>Avatar Store</Text> */}
        {/* <AvatarSvg width={50} height={50} /> */}
        <Image
          source={require('../assets/icons/frame-border.png')}
          style={styles.avatarWindow}
        />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  avatarWindow: {
    width: width * 0.6,
    height: height * 0.6,
    marginBottom: height * 0.05,
  },
});

export default AvatarScreen;
