import React, {useState, useEffect} from 'react';
import {View, StyleSheet, PanResponder, Dimensions} from 'react-native';
import Svg, {Path, Defs, ClipPath, G, Image} from 'react-native-svg';
import {getStroke} from 'perfect-freehand';
import {getSvgPathFromStroke} from '../utils/getSvgFromStroke';
import {dzongkhaLetters} from '../data/dzongkhaLetters';
import Kha from '../assets/kha.svg';

const options = {
  size: 45,
  smoothing: 1,
  streamline: 1,
  easing: (t: number) => t,
  start: {
    taper: 0,
    easing: (t: number) => t,
    cap: true,
  },
  end: {
    taper: 0,
    easing: (t: number) => t,
    cap: true,
  },
};

interface DrawingCanvasProps {
  clear: Boolean;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({clear}) => {
  const [points, setPoints] = useState<number[][]>([]);
  const [pathData, setPathData] = useState<string>('');

  useEffect(() => {
    if (clear) {
      setPoints([]);
    }
  }, [clear]);

  useEffect(() => {
    const stroke = getStroke(points, options);
    const path = getSvgPathFromStroke(stroke);
    setPathData(path);
  }, [points]);

  const clipPathData = dzongkhaLetters[2].svgPath;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: evt => {
      const {locationX, locationY} = evt.nativeEvent;
      setPoints(prev => [...prev, [locationX, locationY]]);
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg style={styles.svg} width={210} height={200}>
        <Kha />
        <Defs>
          <ClipPath id="clip">
            <Path d={clipPathData} fill="black" />
          </ClipPath>
        </Defs>
        <G clipPath="url(#clip)">
          <Path d={pathData} stroke="black" strokeWidth={1} fill="black" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    backgroundColor: 'pink',
  },
});

export default DrawingCanvas;
