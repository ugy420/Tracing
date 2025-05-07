import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {
  Canvas,
  Fill,
  Mask,
  Path,
  Skia,
  SkPath,
  SkPoint,
  Group,
  Image,
  useImage,
} from '@shopify/react-native-skia';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useSharedValue, runOnJS, withSpring} from 'react-native-reanimated';
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
import LottieView from 'lottie-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

// Assets
const backgroundImage = require('../assets/background_images/home_bg.png');
const pencilIcon = require('../assets/icons/pencil.png');
const eraserIcon = require('../assets/icons/eraser.png');
const starImage = require('../assets/icons/star.png'); // Added starImage
const starAnimation = require('../assets/lottie_anime/celebration1.json');

type TracingScreenRouteProp = RouteProp<RootStackParamList, 'Tracing'>;

const {width, height} = Dimensions.get('window');

const Tracing = () => {
  const route = useRoute<TracingScreenRouteProp>();
  const {id, category} = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentPart, setCurrentPart] = useState(0);
  const drawPath = useSharedValue<SkPath>(Skia.Path.Make());
  const [checkpoints, setCheckpoints] = useState<SkPoint[]>([]);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<boolean[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedParts, setCompletedParts] = useState<number[]>([]);
  const threshold = 25;
  const pencilImage = useImage(pencilIcon);
  const pencilPos = useSharedValue({x: 0, y: 0});
  const isDrawing = useSharedValue(false);
  const dataSource =
    category === 'alphabets' ? dzongkhaLetters : numbersTracing;
  const selectedItem = dataSource.find(item => item.id === id);

  if (!selectedItem) {
    console.error(`Item with id ${id} not found for category ${category}`);
    return null;
  }
  const svgString = selectedItem.svgPath;
  const svgGuides = selectedItem.guidePath;
  const characterName = selectedItem.name;

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
    setCompletedParts(prev => [...prev, currentPart]);
    if (currentPart < svgGuides.length - 1) {
      drawPath.value = Skia.Path.Make();
      setCurrentPart(currentPart + 1);
    } else if (currentPart === svgGuides.length - 1) {
      setShowConfetti(true);
      setTimeout(() => {
        navigation.navigate('CompletionScreen', {category});
      }, 2000);
    }
  };

  const reset = () => {
    drawPath.value = Skia.Path.Make();
    setVisitedCheckpoints(Array(checkpoints.length).fill(false));
    // setCurrentPart(0);
    // setVisitedCheckpoints([]);
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

      // Get the current and next+3 checkpoints
      const currentCp = checkpoints[nextCheckpointIndex];
      const nextPlus3Cp = checkpoints[nextCheckpointIndex + 3];

      // Check if touch is near the next checkpoint
      if (currentCp) {
        const dx = x - currentCp.x;
        const dy = y - currentCp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold) {
          updated[nextCheckpointIndex] = true;
        }
      }

      // Check if touch is near the next+3 checkpoint (skip intermediate points)
      if (nextPlus3Cp) {
        const dx = x - nextPlus3Cp.x;
        const dy = y - nextPlus3Cp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold) {
          // Mark current, next, next+1, next+2 as visited
          for (
            let i = 0;
            i < 4 && nextCheckpointIndex + i < updated.length;
            i++
          ) {
            updated[nextCheckpointIndex + i] = true;
          }
        }
      }

      // If all checkpoints are visited, move to next part
      if (updated.every(v => v)) {
        runOnJS(handleNextPart)();
        return Array(checkpoints.length).fill(false);
      }

      return updated;
    });
  };

  const gesture = Gesture.Pan()
    .onBegin(event => {
      'worklet';
      isDrawing.value = true;
      pencilPos.value = withSpring({x: event.x - 20, y: event.y - 40});

      if (checkpoints.length === 0) {
        return;
      }
      const nextCheckpointIndex = visitedCheckpoints.findIndex(v => !v);
      if (nextCheckpointIndex === -1) return;

      // Get the next and next+3 checkpoints
      const nextCp = checkpoints[nextCheckpointIndex];
      const nextPlus3Cp = checkpoints[nextCheckpointIndex + 3];

      // More generous starting threshold
      const startThreshold = threshold * 1.5;

      // Check if starting near either valid checkpoint
      if (nextCp) {
        const dx = nextCp.x - event.x;
        const dy = nextCp.y - event.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < startThreshold) {
          drawPath.value = Skia.Path.Make();
          drawPath.value.moveTo(event.x, event.y);
          drawPath.modify();
        }
      }

      if (nextPlus3Cp) {
        const dx = nextPlus3Cp.x - event.x;
        const dy = nextPlus3Cp.y - event.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < startThreshold) {
          drawPath.value = Skia.Path.Make();
          drawPath.value.moveTo(event.x, event.y);
          drawPath.modify();
        }
      }
    })
    .onChange(event => {
      'worklet';
      // Need to understand
      pencilPos.value = withSpring({x: event.x - 20, y: event.y - 40});

      // Allow tracing only for the next checkpoint in sequence
      const nextCheckpointIndex = visitedCheckpoints.findIndex(v => !v);

      if (nextCheckpointIndex === -1) {
        return;
      }

      // Get the next and next+3 checkpoints
      const nextCp = checkpoints[nextCheckpointIndex];
      const nextPlus3Cp = checkpoints[nextCheckpointIndex + 3];

      // Calculate distances
      let distToNext = Infinity;
      let distToNextPlus3 = Infinity;

      if (nextCp) {
        const dx = nextCp.x - event.x;
        const dy = nextCp.y - event.y;
        distToNext = Math.sqrt(dx * dx + dy * dy);
      }

      if (nextPlus3Cp) {
        const dx = nextPlus3Cp.x - event.x;
        const dy = nextPlus3Cp.y - event.y;
        distToNextPlus3 = Math.sqrt(dx * dx + dy * dy);
      }

      // Determine which checkpoint is closer
      const minDist = Math.min(distToNext, distToNextPlus3);

      // Only draw if within threshold of either checkpoint
      if (minDist < threshold * 1.2) {
        if (drawPath.value.isEmpty()) {
          drawPath.value.moveTo(event.x, event.y);
        } else {
          const lastPoint = drawPath.value.getLastPt();
          const controlX = (lastPoint.x + event.x) / 2;
          const controlY = (lastPoint.y + event.y) / 2;
          drawPath.value.quadTo(controlX, controlY, event.x, event.y);
        }
        drawPath.modify();

        runOnJS(updateVisitedCheckpoints)(event.x, event.y);
      }
    })
    // .minDistance(1); // Make it more sensitive to small movements

    .onFinalize(() => {
      'worklet';
      isDrawing.value = false;
      pencilPos.value = withSpring({x: -100, y: -100});
    })
    .minDistance(1);

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{x: width / 2, y: 0}}
          fadeOut={true}
        />
      )}

      <View style={styles.header}>
        <Text style={styles.title}>Trace the {characterName}</Text>
      </View>

      <GestureHandlerRootView style={styles.canvasWrapper}>
        <GestureDetector gesture={gesture}>
          <Canvas style={styles.canvasContainer}>
            <Fill color="#FFEDC2" />

            {/* Main character outline */}
            <Path
              path={Skia.Path.MakeFromSVGString(svgString)!}
              color="#5E2B97"
              strokeWidth={4}
              style="stroke"
            />

            {/* Guide paths */}
            {svgGuides.map((guide, index) => {
              try {
                const path = Skia.Path.MakeFromSVGString(guide);
                if (!path) return null;
                return (
                  <Path
                    key={`guide-${index}`}
                    path={path}
                    color={currentPart === index ? '#FF7D33' : '#E0E0E0'}
                    strokeWidth={currentPart === index ? 3 : 2}
                    style="stroke"
                    strokeCap="round"
                    strokeJoin="round"
                  />
                );
              } catch (err) {
                console.warn(`Invalid SVG path at index ${index}:`, guide);
                return null;
              }
            })}

            {/* User drawing with mask */}
            <Mask
              mask={
                <Path
                  path={drawPath}
                  color="black"
                  strokeWidth={30}
                  style="stroke"
                  strokeCap="round"
                  strokeJoin="round"
                />
              }>
              <Path
                path={Skia.Path.MakeFromSVGString(svgString)!}
                color="#FF7D33"
                strokeWidth={4}
                style="stroke"
              />
            </Mask>

            {/* Checkpoints */}
            {checkpoints.map((pt, index) => (
              <Group key={`cp-${index}`}>
                {visitedCheckpoints[index] && (
                  <Image
                    image={starImage}
                    x={pt.x - 15}
                    y={pt.y - 15}
                    width={30}
                    height={30}
                  />
                )}
                <Path
                  path={Skia.Path.Make().addCircle(pt.x, pt.y, 8)}
                  color={visitedCheckpoints[index] ? '#4CAF50' : '#F44336'}
                />
              </Group>
            ))}

            {/* Pencil cursor */}
            {isDrawing && pencilImage && (
              <Image
                image={pencilImage}
                x={pencilPos.value.x}
                y={pencilPos.value.y}
                width={40}
                height={40}
              />
            )}
          </Canvas>
        </GestureDetector>
      </GestureHandlerRootView>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={reset}>
          <ImageBackground source={eraserIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

        <LottieView
          source={starAnimation}
          autoPlay
          loop
          style={styles.animation}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleNextPart}
          disabled={currentPart === svgGuides.length - 1}>
          <Text style={styles.buttonText}>
            {currentPart === svgGuides.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  header: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 237, 194, 0.8)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 5,
    color: '#5E2B97',
    fontFamily: 'KidsFont', // Use a kid-friendly font
  },
  canvasWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#FFB347',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 237, 194, 0.8)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5E2B97',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animation: {
    width: 60,
    height: 60,
  },
});
export default Tracing;
