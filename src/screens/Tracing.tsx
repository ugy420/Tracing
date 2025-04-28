import React, {useEffect, useState} from 'react';
import {View, Button} from 'react-native';
import {
  Canvas,
  Fill,
  Mask,
  Path,
  Skia,
  SkPath,
  SkPoint,
} from '@shopify/react-native-skia';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useSharedValue, runOnJS} from 'react-native-reanimated';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import {dzongkhaLetters} from '../data/dzongkhaLetters';
import {svgPathProperties} from 'svg-path-properties';

type TracingScreenRouteProp = RouteProp<RootStackParamList, 'Tracing'>;

const Tracing = () => {
  const route = useRoute<TracingScreenRouteProp>();
  const {id} = route.params;
  const letter = dzongkhaLetters.find(letter => letter.id === id);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  if (!letter) {
    console.error(`Letter with id ${id} not found`);
    return null;
  }
  const svgString = letter.svgPath;
  const svgGuides = letter.guidePath;
  const [currentPart, setCurrentPart] = useState(0);
  const drawPath = useSharedValue<SkPath>(Skia.Path.Make());
  const [checkpoints, setCheckpoints] = useState<SkPoint[]>([]);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<boolean[]>([]);
  const threshold = 20;
  const generateCheckpoints = (svg: string, numPoints = 100): SkPoint[] => {
    try {
      const props = new svgPathProperties(svg);
      const length = props.getTotalLength();
      const points: SkPoint[] = [];
      for (let i = 0; i < numPoints; i++) {
        const dist = (i / (numPoints - 1)) * length; const { x, y } = props.getPointAtLength(dist);
        points.push({ x, y });
      }
      return points;
    } catch (err) {
      console.warn("Failed to generate checkpoints:", err); return [];
    }
  }; useEffect(() => {
    const newCheckpoints = generateCheckpoints(letter.guidePath[currentPart]);
    setCheckpoints(newCheckpoints);
    setVisitedCheckpoints(Array(newCheckpoints.length).fill(false));
  }, [currentPart]);
  const handleNextPart = () => {
    if (currentPart < svgGuides.length - 1) {
      setCurrentPart(currentPart + 1);
    } else if (currentPart === svgGuides.length - 1) {
      console.log('All parts completed');
      // Alert.alert('Congratulations!', 'You have completed the tracing!');
      navigation.navigate('CompletionScreen');
    }
  };
  const reset = () => {
    drawPath.value = Skia.Path.Make();
    setCurrentPart(0);
  };
  const updateVisitedCheckpoints = (x: number, y: number) => {
    setVisitedCheckpoints(prev => {
      const updated = [...prev];
      checkpoints.forEach((cp, index) => {
        const dx = x - cp.x; const dy = y - cp.y; const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold && !updated[index]) {
          updated[index] = true;
        }
      });
      if (updated.every((v) => v)) {
        runOnJS(handleNextPart)();
        return Array(checkpoints.length).fill(false);
      }
      return updated;
    });
  };
  const gesture = Gesture.Pan().onBegin((event) => {
    const near = checkpoints.some((pt) => {
      const dx = pt.x - event.x; const dy = pt.y - event.y; return Math.sqrt(dx * dx + dy * dy) < threshold - 5;
    });
    if (near) { drawPath.value.moveTo(event.x, event.y); drawPath.modify(); }
  }).onChange((event) => {
    const near = checkpoints.some((pt) => {
      const dx = pt.x - event.x; const dy = pt.y - event.y;
      return Math.sqrt(dx * dx + dy * dy) < threshold - 5;
    });
    if (near) {
      drawPath.value.lineTo(event.x, event.y);
      drawPath.modify();
      runOnJS(updateVisitedCheckpoints)(event.x, event.y);
    }
  });
  return (
    <View style={{flex: 1, backgroundColor: 'orange'}}>
      <Button title="Reset" onPress={reset} />
      <GestureHandlerRootView>
        <GestureDetector gesture={gesture}>
          <Canvas style={{ width: "25%", height: "90%", alignSelf: "center" }}>
            <Fill color="orange" />
            <Path path={Skia.Path.MakeFromSVGString(svgString)!} color={"white"} />
            <Mask mask={
              <Path path={drawPath}
                color="black"
                strokeWidth={50}
                style="stroke" />
            }
            >
              <Path path={Skia.Path.MakeFromSVGString(svgString)!} color="white" />
            </Mask>
            {checkpoints.map((pt, index) => (
              <Path
                key={`cp-${index}`}
                path={Skia.Path.Make().addCircle(pt.x, pt.y, 5)}
                color={visitedCheckpoints[index] ? "green" : "red"} />
            ))
            }
            {svgGuides.map((guide, index) => {
  try {
    const path = Skia.Path.MakeFromSVGString(guide);
    if (!path) throw new Error(`Invalid path at index ${index}`);
    return (
      <Path
        key={`guide-${index}`}
        path={path}
        color="black"
        strokeWidth={2}
        style="stroke"
      />
    );
  } catch (err) {
    console.warn(`Invalid SVG path at index ${index}:`, guide);
    return null;
  }
})}
          </Canvas>
        </GestureDetector>
      </GestureHandlerRootView>
    </View >
  );
};

export default Tracing;
