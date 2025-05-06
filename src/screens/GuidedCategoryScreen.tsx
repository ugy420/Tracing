import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import CardCategory from '../components/CardCategory';
import {cardAlphabetData} from '../components/alphabetCardData';
import {cardNumberData} from '../components/numberCardData';
import {useMusic} from '../components/MusicContext';

const GuidedCategory = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'GuidedCategory'>>();
  const {category} = route.params; // Get the category parameter
  const {isMuted, toggleMute} = useMusic();

  const cardData =
    category === 'alphabets'
      ? cardAlphabetData
      : category === 'numbers'
      ? cardNumberData
      : [];
  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.navigate('Guided')}>
              <Image
                source={require('../assets/icons/back_color.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.dzongkhaText}>དབྱེ་རིམ།</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleMute}>
              <Image
                source={
                  isMuted
                    ? require('../assets/icons/mute.png')
                    : require('../assets/icons/volume.png')
                }
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

        <View style={styles.contentContainer}>
          <FlatList
            data={cardData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(item.screen, {id: item.id, category})
                }>
                <CardCategory
                  text={item.text}
                  backgroundColor={item.backgroundColor}
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            horizontal={true}
            contentContainerStyle={styles.cardContainer}
            showsHorizontalScrollIndicator={false}
            snapToInterval={120}
            decelerationRate="fast"
          />

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => navigation.navigate('QuizHomeScreen')}>
            <Text style={styles.quizButtonText}>འདྲི་རྩད་ རྒྱུགས</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  dzongkhaText: {
    fontFamily: 'joyig',
    color: '#4B0082',
    fontSize: 60,
    lineHeight: 70,
    marginTop: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    paddingInline: 25,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
    elevation: 5,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 54,
    fontFamily: 'joyig',
    textAlign: 'center',
  },
});

export default GuidedCategory;
