import { View, StyleSheet } from 'react-native';
import ColorButton from './ColorButton';

interface SideBarProps {
  clearCanvas: () => void;
}

export default function SideBar({clearCanvas}: SideBarProps) {
  return (
    <View style={styles.container}>
      <ColorButton title="del" color="red" onPress={clearCanvas}/>
      <ColorButton title="sound" color="blue" onPress={() => {}} />
      <ColorButton title="back" color="orange" onPress={() => {}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  }
});