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
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import CardCategory from '../components/CardCategory';

type CardItem = {
  id: string;
  text: string;
  backgroundColor: any;
  screen: 'Tracing';
};

const GuidedCategory = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const CardBgColors = [
    'rgb(83, 213, 230)',
    'rgb(234, 216, 103)',
    'rgb(237, 135, 203)',
    'rgb(69, 173, 224)',
    'rgb(158, 105, 227)',
  ];

  const cardData: CardItem[] = [
    {id: '1', text: 'ཀ', backgroundColor: CardBgColors[0], screen: 'Tracing'},
    {id: '2', text: 'ཁ', backgroundColor: CardBgColors[1], screen: 'Tracing'},
    {
      id: '3',
      text: 'ང',
      backgroundColor: CardBgColors[2],
      screen: 'Tracing',
    },
    {
      id: '4',
      text: 'ང',
      backgroundColor: CardBgColors[3],
      screen: 'Tracing',
    },
  ];

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Image
                source={require('../assets/icons/home.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Guided')}>
              <Image
                source={require('../assets/icons/back_color.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.dzongkhaText}>དབྱེ་རིམ།</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity>
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

        <View style={styles.contentContainer}>
          <FlatList
            data={cardData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate(item.screen, {id: item.id})}>
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
            onPress={() => navigation.navigate('QuizScreen')}>
            <Text style={styles.quizButtonText}>Attempt Quiz</Text>
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
    fontSize: 60,
    lineHeight: 70,
    marginBottom: 5,
    textAlign: 'center',
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
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 30,
    elevation: 5,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GuidedCategory;
