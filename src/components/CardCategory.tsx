import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface CardCategoryProps {
  text: string;
  backgroundColor: string;
}

const CardCategory: React.FC<CardCategoryProps> = ({text, backgroundColor}) => {
  return (
    <View style={[styles.card, {backgroundColor}]}>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#14D0FF',
    padding: 20,
    height: 150,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: 10,
    margin: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontFamily: 'joyig',
    lineHeight: 120,
    fontSize: 100,
    textAlign: 'center',
    color: 'white',
  },
});
export default CardCategory;
