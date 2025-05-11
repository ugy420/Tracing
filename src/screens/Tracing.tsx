import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Canvas,
  Fill,
  Path,
  Skia,
  SkPath,
  SkPoint,
  Group,
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
import LottieView from 'lottie-react-native';

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
  const starAnimation = require('../assets/lottie_anime/celebration.json');
  const [completedCheckpoints, setCompletedCheckpoints] = useState<SkPoint[][]>(
    [],
  );
  const [animationPhase, setAnimationPhase] = useState<
    'tracing' | 'showCompleted' | 'complete'
  >('tracing');

  // Add states for scaling and transformation
  const [, setSvgBounds] = useState({width: 0, height: 0});
  const [scaleFactor, setScaleFactor] = useState(1);
  const [transformMatrix, setTransformMatrix] = useState<number[]>([
    1, 0, 0, 1, 0, 0,
  ]);

  // Transform object for Skia Group
  const [transformObject, setTransformObject] = useState({
    scaleX: 1,
    skewY: 0,
    skewX: 0,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
  });

  const checkPointOrder = React.useMemo(() => {
    return category === 'alphabets'
      ? alphabetCheckPoints
      : category === 'numbers'
      ? numberCheckPoints
      : {};
  }, [category]);

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
  const characterName = selectedItem.name;

  // Calculate SVG bounds and transformation matrix
  useEffect(() => {
    try {
      const path = Skia.Path.MakeFromSVGString(svgString);
      if (path) {
        // Get the bounds of the SVG path
        const bounds = path.getBounds();

        // Use default size if bounds are invalid
        const boundWidth =
          isFinite(bounds.width) && bounds.width > 0 ? bounds.width : 100;
        const boundHeight =
          isFinite(bounds.height) && bounds.height > 0 ? bounds.height : 100;
        const boundLeft = isFinite(bounds.x) ? bounds.x : 0;
        const boundTop = isFinite(bounds.y) ? bounds.y : 0;

        setSvgBounds({
          width: boundWidth,
          height: boundHeight,
        });

        // Calculate canvas size based on screen dimensions
        const {width, height} = Dimensions.get('window');
        const canvasWidth = width * 0.35;
        const canvasHeight = height * 0.55;

        // Calculate scale factors to fit the character into our standard viewport
        const scaleX = (canvasWidth * 0.8) / boundWidth;
        const scaleY = (canvasHeight * 0.8) / boundHeight;

        // Use the smaller scale factor to maintain aspect ratio
        const scaleFactor = Math.min(scaleX, scaleY);
        setScaleFactor(scaleFactor);

        // Calculate centering offsets
        const offsetX =
          (canvasWidth - boundWidth * scaleFactor) / 2 -
          boundLeft * scaleFactor;
        const offsetY =
          (canvasHeight - boundHeight * scaleFactor) / 2 -
          boundTop * scaleFactor;

        // Create transformation matrix [scaleX, skewY, skewX, scaleY, translateX, translateY]
        // Ensure all values are valid numbers
        const matrix = [
          isFinite(scaleFactor) ? scaleFactor : 1,
          0,
          0,
          isFinite(scaleFactor) ? scaleFactor : 1,
          isFinite(offsetX) ? offsetX : 0,
          isFinite(offsetY) ? offsetY : 0,
        ];

        // console.log('Calculated transform matrix:', matrix);
        setTransformMatrix(matrix);

        // Also create a transform object that Skia Group will accept
        setTransformObject({
          scaleX: isFinite(scaleFactor) ? scaleFactor : 1,
          skewY: 0,
          skewX: 0,
          scaleY: isFinite(scaleFactor) ? scaleFactor : 1,
          translateX: isFinite(offsetX) ? offsetX : 0,
          translateY: isFinite(offsetY) ? offsetY : 0,
        });
      }
    } catch (err) {
      console.warn('Error calculating SVG bounds:', err);
      // Set default transformation matrix
      setTransformMatrix([1, 0, 0, 1, 0, 0]);
      setTransformObject({
        scaleX: 1,
        skewY: 0,
        skewX: 0,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
      });
    }
  }, [svgString]);

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
    const allCheckpoints = svgGuides.map((guide, partIndex) => {
      const partCheckpoints = generateCheckpoints(guide);
      const currentOrder = checkPointOrder[Number(id)]?.[partIndex] || [];
      return currentOrder
        .filter(index => index >= 0 && index < partCheckpoints.length)
        .map(index => partCheckpoints[index])
        .filter(Boolean) as SkPoint[];
    });
    setCompletedCheckpoints(allCheckpoints);
  }, [svgGuides, checkPointOrder, id]);

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
      // Start showing completed animation
      setAnimationPhase('showCompleted');

      // After 2 seconds, proceed to completion
      setTimeout(() => {
        setAnimationPhase('complete');
        navigation.navigate('CompletionScreen', {category});
      }, 2000);
      console.log('All parts completed');
    }
  };

  // Function to transform a point from screen coordinates to SVG coordinates
  const screenToSvgPoint = (x: number, y: number): SkPoint => {
    // Invert the transformation
    const sx = transformObject.scaleX;
    const sy = transformObject.scaleY;
    const tx = transformObject.translateX;
    const ty = transformObject.translateY;

    // Only apply inverse transform if scales are non-zero to avoid division by zero
    if (sx !== 0 && sy !== 0) {
      return {
        x: (x - tx) / sx,
        y: (y - ty) / sy,
      };
    }

    // Return original point if transformation is invalid
    return {x, y};
  };

  // Function to transform a point from SVG coordinates to screen coordinates
  const svgToScreenPoint = (point: SkPoint): SkPoint => {
    if (!point || typeof point !== 'object' || point === null) {
      console.warn('Invalid point provided to transformPoint:', point);
      return {x: 0, y: 0};
    }

    return {
      x: point.x * transformObject.scaleX + transformObject.translateX,
      y: point.y * transformObject.scaleY + transformObject.translateY,
    };
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const updateVisitedCheckpoints = (x: number, y: number) => {
    // Convert screen coordinates to SVG coordinates for checkpoint testing
    const svgPoint = screenToSvgPoint(x, y);

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
        const dx = svgPoint.x - currentCp.x;
        const dy = svgPoint.y - currentCp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < threshold) {
          updated[nextCheckpointIndex] = true;
        }
      }

      // Check if touch is near the next+3 checkpoint (skip intermediate points)
      if (nextPlus3Cp) {
        const dx = svgPoint.x - nextPlus3Cp.x;
        const dy = svgPoint.y - nextPlus3Cp.y;
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
      if (checkpoints.length === 0) {
        return;
      }
      // Convert screen coordinates to SVG coordinates
      const svgPoint = {
        x: (event.x - transformObject.translateX) / transformObject.scaleX,
        y: (event.y - transformObject.translateY) / transformObject.scaleY,
      };

      const nextCheckpointIndex = visitedCheckpoints.findIndex(v => !v);
      if (nextCheckpointIndex === -1) {
        return;
      }

      // Get the next and next+3 checkpoints
      const nextCp = checkpoints[nextCheckpointIndex];
      const nextPlus3Cp = checkpoints[nextCheckpointIndex + 3];

      // More generous starting threshold
      const startThreshold = threshold * 1.5;

      // Check if starting near either valid checkpoint
      if (nextCp) {
        const dx = nextCp.x - svgPoint.x;
        const dy = nextCp.y - svgPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < startThreshold) {
          drawPath.value = Skia.Path.Make();
          drawPath.value.moveTo(event.x, event.y);
          drawPath.modify();
        }
      }

      if (nextPlus3Cp) {
        const dx = nextPlus3Cp.x - svgPoint.x;
        const dy = nextPlus3Cp.y - svgPoint.y;
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

      // Convert screen coordinates to SVG coordinates for checkpoint detection
      const svgPoint = {
        x: (event.x - transformObject.translateX) / transformObject.scaleX,
        y: (event.y - transformObject.translateY) / transformObject.scaleY,
      };

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
        const dx = nextCp.x - svgPoint.x;
        const dy = nextCp.y - svgPoint.y;
        distToNext = Math.sqrt(dx * dx + dy * dy);
      }

      if (nextPlus3Cp) {
        const dx = nextPlus3Cp.x - svgPoint.x;
        const dy = nextPlus3Cp.y - svgPoint.y;
        distToNextPlus3 = Math.sqrt(dx * dx + dy * dy);
      }

      // Determine which checkpoint is closer
      const minDist = Math.min(distToNext, distToNextPlus3);

      // Scale threshold according to transformations
      const adjustedThreshold = (threshold / scaleFactor) * 1.2;

      // Only draw if within threshold of either checkpoint
      if (minDist < adjustedThreshold) {
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
    .minDistance(1); // Make it more sensitive to small movements

  return (
    <ImageBackground
      source={require('../assets/background_images/home_bg.png')}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ཡི་གུ་ {characterName}་ འཁྱིད་ཐིག་འབད།</Text>
      </View>

      <GestureHandlerRootView style={styles.canvasWrapper}>
        <GestureDetector gesture={gesture}>
          <Canvas style={styles.canvasContainer}>
            <Fill color="#FFEDC2" />

            {/* Main character outline */}
            <Group
              transform={[
                {scaleX: transformObject.scaleX},
                {scaleY: transformObject.scaleY},
                {translateX: transformObject.translateX},
                {translateY: transformObject.translateY},
                {skewX: transformObject.skewX},
                {skewY: transformObject.skewY},
              ]}>
              <Path
                path={Skia.Path.MakeFromSVGString(svgString)!}
                color={'white'}
                // style="stroke"
                // strokeWidth={4}
              />

              {animationPhase === 'tracing' ? (
                // Show tracing UI
                <>
                  {/* Guide paths */}
                  {svgGuides.map((guide, index) => {
                    try {
                      const path = Skia.Path.MakeFromSVGString(guide);
                      if (!path) {
                        return null;
                      }
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
                      console.warn(
                        `Invalid SVG path at index ${index}:`,
                        guide,
                      );
                      return null;
                    }
                  })}

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
                      console.warn(
                        `Invalid SVG path at index ${index}:`,
                        guide,
                      );
                      return null;
                    }
                  })}
                </>
              ) : (
                // Show completed animation
                <>
                  {/* Completed character in green */}
                  <Path
                    path={Skia.Path.MakeFromSVGString(svgString)!}
                    color="#4CAF50"
                    style="stroke"
                    strokeWidth={4}
                  />

                  {/* All completed checkpoints */}
                  {completedCheckpoints.flat().map((pt, index) => (
                    <Path
                      key={`completed-cp-${index}`}
                      path={Skia.Path.Make().addCircle(pt.x, pt.y, 5)}
                      color="#4CAF50"
                    />
                  ))}
                </>
              )}
            </Group>
          </Canvas>
        </GestureDetector>
      </GestureHandlerRootView>

      {animationPhase === 'showCompleted' && (
        <LottieView
          source={starAnimation}
          autoPlay
          loop={false}
          style={styles.celebrationAnimation}
        />
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <ImageBackground
            source={require('../assets/icons/back.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'orange',
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    padding: 7,
    backgroundColor: 'rgba(255, 237, 194, 0.8)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: height * 0.14,
    padding: 5,
    color: '#5E2B97',
    // fontFamily: 'KidsFont', // Use a kid-friendly font
    fontFamily: 'joyig',
  },
  canvasWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasContainer: {
    width: width * 0.35,
    height: height * 0.55,
    alignSelf: 'center', // Center the canvas itself
    backgroundColor: '#FFF9E6', // Optional: Add a background color
    borderRadius: 10,
    overflow: 'hidden', // Ensure content doesn't overflow
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5E2B97',
    paddingVertical: 10,
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
    width: 50,
    height: 50,
  },
  celebrationAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
});

export default Tracing;
