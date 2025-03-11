import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  // Button,
} from 'react-native';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../types';
import CardCategory from '../components/CardCategory';

const GuidedCategory = () => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const CardBgColors = ['#14D0FF', '#FFD214', '#FF14D0', '#14FFD0', '#fa6f05'];

  const cardData = Array.from('ཀཁགངཅཆཀཁགངཅཆ', (char, index) => ({
    id: index.toString(),
    text: char,
    backgroundColor: CardBgColors[index % CardBgColors.length],
  }));

  return (
    <ImageBackground
      source={require('../assets/background_images/guided_bg.jpeg')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.dzongkhaText}>དབྱེ་རིམ།</Text>
        {/* <Button
          title="To Next"
          onPress={() => navigation.navigate('Guided')}
        /> */}
        <FlatList
          data={cardData}
          renderItem={({item}) => (
            <CardCategory
              text={item.text}
              backgroundColor={item.backgroundColor}
            />
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
});

export default GuidedCategory;
