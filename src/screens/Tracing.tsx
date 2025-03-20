import DrawingCanvas from '../components/DrawingCanvas';
import SideBar from '../components/SideBar';
import {View, StyleSheet} from 'react-native';
import {useState} from 'react';

export default function Practice() {
  const [clear, setClear] = useState(false);

  function clearCanvas() {
    setClear(true);
    setTimeout(() => {
      setClear(false);
    }, 0);
  }

  return (
    <View style={styles.container}>
      <DrawingCanvas clear={clear} />
      <SideBar clearCanvas={clearCanvas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
