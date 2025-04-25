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
  screen: keyof RootStackParamList;
};

const GuidedCategory = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const CardBgColors = ['#14D0FF', '#FFD214', '#FF14D0', '#14FFD0', '#fa6f05'];

  const cardData: CardItem[] = [
    {id: '1', text: 'ཀ', backgroundColor: CardBgColors[0], screen: 'Tracing'},
    {id: '2', text: 'ཁ', backgroundColor: CardBgColors[1], screen: 'Home'},
    {id: '3', text: 'ག', backgroundColor: CardBgColors[2], screen: 'Home'},
    {id: '4', text: 'ང', backgroundColor: CardBgColors[3], screen: 'Home'},
    {id: '5', text: 'ཅ', backgroundColor: CardBgColors[4], screen: 'Home'},
    {id: '6', text: 'ཆ', backgroundColor: CardBgColors[0], screen: 'Home'},
    {id: '7', text: 'ཇ', backgroundColor: CardBgColors[1], screen: 'Home'},
    {id: '8', text: 'ཉ', backgroundColor: CardBgColors[2], screen: 'Home'},
    {id: '9', text: 'ཏ', backgroundColor: CardBgColors[3], screen: 'Home'},
  ];

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}>  {/* Changed from GuidedCategory to Home */}
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
            <TouchableOpacity>  {/* Added TouchableOpacity for consistency */}
              <Image
                source={require('../assets/icons/volume.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')}>  {/* Added navigation to Settings */}
              <Image
                source={require('../assets/icons/setting_color.png')}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={cardData}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => navigation.navigate(item.screen)}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  dzongkhaText: {
    fontSize: 25,
    lineHeight: 70,
    marginBottom: 5,
    fontWeight: 'bold',
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default GuidedCategory;