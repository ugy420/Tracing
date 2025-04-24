import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface ColorButtonProps {
  title: string;
  color: string;
  onPress: () => void;
}

export default function ColorButton({title, color, onPress}: ColorButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: color}]}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
