import React, {useEffect, useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
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
import {dzongkhaLetters} from '../data/tracingData/dzongkhaLetters';
import {svgPathProperties} from 'svg-path-properties';
import alphabetCheckPoints from '../data/checkPoints/alphabetsCheckPoints';
import {numbersTracing} from '../data/tracingData/numbersTracing';
import numberCheckPoints from '../data/checkPoints/numbersCheckPoints';

type TracingScreenRouteProp = RouteProp<RootStackParamList, 'Tracing'>;

const Tracing = () => {
  const route = useRoute<TracingScreenRouteProp>();
  const {id, category} = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentPart, setCurrentPart] = useState(0);
  const drawPath = useSharedValue<SkPath>(Skia.Path.Make());
  const [checkpoints, setCheckpoints] = useState<SkPoint[]>([]);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<boolean[]>([]);
  const threshold = 25;

  const dataSource =
    category === 'alphabets' ? dzongkhaLetters : numbersTracing;
  const selectedItem = dataSource.find(item => item.id === id);

  // const letter = dzongkhaLetters.find(letter => letter.id === id);

  if (!selectedItem) {
    console.error(`Item with id ${id} not found for category ${category}`);
    return null;
  }
  const svgString = selectedItem.svgPath;
  const svgGuides = selectedItem.guidePath;

  // Determine the correct checkpoint order based on the category
  const checkPointOrder =
    category === 'alphabets'
      ? alphabetCheckPoints
      : category === 'numbers'
      ? numberCheckPoints
      : {};

  const generateCheckpoints = (svg: string, numPoints = 50): SkPoint[] => {
    try {
      const props = new svgPathProperties(svg);
      const length = props.getTotalLength();
      const points: SkPoint[] = [];
      for (let i = 0; i < numPoints; i++) {
        const dist = (i / (numPoints - 1)) * length;
        const {x, y} = props.getPointAtLength(dist);
        points.push({x, y});
      }
      return points;
    } catch (err) {
      console.warn('Failed to generate checkpoints:', err);
      return [];
    }
  };

  useEffect(() => {
    const newCheckpoints = generateCheckpoints(svgGuides[currentPart]);
    // console.log('checkpoints:', newCheckpoints);

    const currentOrder = checkPointOrder[Number(id)]?.[currentPart] || [];

    // Filter out invalid indices and ensure they exist in newCheckpoints
    const reorderedCheckpoints = currentOrder
      .filter(index => index >= 0 && index < newCheckpoints.length)
      .map(index => newCheckpoints[index])
      .filter(Boolean) as SkPoint[];

    // console.log('New checkpoints:', reorderedCheckpoints);

    setCheckpoints(reorderedCheckpoints);
    setVisitedCheckpoints(Array(reorderedCheckpoints.length).fill(false));
  }, [currentPart, svgGuides]);

  const handleNextPart = () => {
    // console.log('Next part:', currentPart);
    if (currentPart < svgGuides.length - 1) {
      drawPath.value = Skia.Path.Make();
      setCurrentPart(currentPart + 1);
    } else if (currentPart === svgGuides.length - 1) {
      console.log('All parts completed');
      navigation.navigate('CompletionScreen');
    }
  };

  const reset = () => {
    drawPath.value = Skia.Path.Make();
    setCurrentPart(0);
    setVisitedCheckpoints([]);
  };

  const updateVisitedCheckpoints = (x: number, y: number) => {
    setVisitedCheckpoints(prev => {
      // Return early if no checkpoints exist
      if (checkpoints.length === 0) {
        return prev;
      }
      const updated = [...prev];

      // Find the next checkpoint to visit
      const nextCheckpointIndex = updated.findIndex(v => !v);

      // Check if nextCheckpointIndex is valid
      if (
        nextCheckpointIndex === -1 ||
        nextCheckpointIndex >= checkpoints.length
      ) {
        return prev;
      }

      const cp = checkpoints[nextCheckpointIndex];
      if (!cp) {
        return prev;
      } // Additional safety check

      const dx = x - cp.x;
      const dy = y - cp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < threshold) {
        updated[nextCheckpointIndex] = true;
      } else if (nextCheckpointIndex + 2 < checkpoints.length) {
        const cpNext = checkpoints[nextCheckpointIndex + 2];
        if (cpNext) {
          // Check if cpNext exists
          const dxNext = x - cpNext.x;
          const dyNext = y - cpNext.y;
          const distNext = Math.sqrt(dxNext * dxNext + dyNext * dyNext);
          if (distNext < threshold) {
            updated[nextCheckpointIndex + 1] = true;
          }
        }
      }

      // Ensure only the next or i+2 checkpoint can be visited
      // if (nextCheckpointIndex !== -1) {
      //   const cp = checkpoints[nextCheckpointIndex];
      //   const dx = x - cp.x;
      //   const dy = y - cp.y;
      //   const dist = Math.sqrt(dx * dx + dy * dy);

      //   if (dist < threshold) {
      //     updated[nextCheckpointIndex] = true; // Mark the checkpoint as visited
      //   } else if (nextCheckpointIndex + 1 < checkpoints.length) {
      //     // Check if the user is near the i+3 checkpoint
      //     const cpNext = checkpoints[nextCheckpointIndex + 2];
      //     const dxNext = x - cpNext.x;
      //     const dyNext = y - cpNext.y;
      //     const distNext = Math.sqrt(dxNext * dxNext + dyNext * dyNext);

      //     if (distNext < threshold) {
      //       updated[nextCheckpointIndex + 1] = true; // Skip i+1 and mark i+2 as visited
      //     }
      //   }
      // }

      // If all checkpoints are visited, move to the next part
      if (updated.every(v => v)) {
        runOnJS(handleNextPart)();
        return Array(checkpoints.length).fill(false); // Reset for the next part
      }

      return updated;
    });
  };

  const gesture = Gesture.Pan()
    .onBegin(event => {
      if (checkpoints.length === 0) {
        return;
      }
      const firstCheckpoint = checkpoints[0];
      if (!firstCheckpoint) {
        return;
      }

      const dx = firstCheckpoint.x - event.x;
      const dy = firstCheckpoint.y - event.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < threshold - 5 && !visitedCheckpoints[0]) {
        drawPath.value.moveTo(event.x, event.y);
        drawPath.modify();
      }
    })
    .onChange(event => {
      // Allow tracing only for the next checkpoint in sequence
      const nextCheckpointIndex = visitedCheckpoints.findIndex(v => !v);

      if (nextCheckpointIndex !== -1) {
        const nextCheckpoint = checkpoints[nextCheckpointIndex];
        const dx = nextCheckpoint.x - event.x;
        const dy = nextCheckpoint.y - event.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold - 5) {
          drawPath.value.lineTo(event.x, event.y);
          drawPath.modify();
          runOnJS(updateVisitedCheckpoints)(event.x, event.y);
        }
      }
    });

  return (
    <View style={styles.container}>
      <Button title="Reset" onPress={reset} />
      <GestureHandlerRootView>
        <GestureDetector gesture={gesture}>
          <Canvas style={styles.canvasContainer}>
            <Fill color="orange" />
            <Path
              path={Skia.Path.MakeFromSVGString(svgString)!}
              color={'white'}
            />
            <Mask
              mask={
                <Path
                  path={drawPath}
                  color="black"
                  strokeWidth={50}
                  style="stroke"
                />
              }>
              <Path
                path={Skia.Path.MakeFromSVGString(svgString)!}
                color="white"
              />
            </Mask>
            {checkpoints.map((pt, index) => (
              <Path
                key={`cp-${index}`}
                path={Skia.Path.Make().addCircle(pt.x, pt.y, 5)}
                color={visitedCheckpoints[index] ? 'green' : 'red'}
              />
            ))}
            {svgGuides.map((guide, index) => {
              try {
                const path = Skia.Path.MakeFromSVGString(guide);
                if (!path) {
                  throw new Error(`Invalid path at index ${index}`);
                }
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  canvasContainer: {
    width: '25%',
    height: '90%',
    alignSelf: 'center',
  },
});

export default Tracing;
