import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import { Canvas, Fill, Mask, Path, Skia, SkPath, SkPoint } from "@shopify/react-native-skia";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from "../types";
import { dzongkhaLetters } from "../data/dzongkhaLetters";
import { svgPathProperties } from "svg-path-properties";


type TracingScreenRouteProp = RouteProp<RootStackParamList, 'Tracing'>;

const Tracing = () => {
  const route = useRoute<TracingScreenRouteProp>();
  const { id } = route.params;
  const letter = dzongkhaLetters.find((letter) => letter.id === id);

  if (!letter) {
    console.error(`Letter with id ${id} not found`);
    return null;
  }

  const svgStrings = letter.svgPath;
  const [currentPart, setCurrentPart] = useState(0);
  const drawPath = useSharedValue<SkPath>(Skia.Path.Make());

  // Checkpoint-related states
  const [checkpoints, setCheckpoints] = useState<SkPoint[]>([]);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<boolean[]>([]);
  const threshold = 25;

  // Generate checkpoints from SVG path
  const generateCheckpoints = (svg: string, numPoints = 10): SkPoint[] => {
    try {
      const props = new svgPathProperties(svg);
      const length = props.getTotalLength();
      const points: SkPoint[] = [];
  
      for (let i = 0; i < numPoints; i++) {
        const dist = (i / (numPoints - 1)) * length;
        const { x, y } = props.getPointAtLength(dist);
        points.push({ x, y });
      }
  
      return points;
    } catch (err) {
      console.warn("Failed to generate checkpoints:", err);
      return [];
    }
  };

  // Update checkpoints on part change
  useEffect(() => {
    const newCheckpoints = generateCheckpoints(svgStrings[currentPart]);
    setCheckpoints(newCheckpoints);
    setVisitedCheckpoints(Array(newCheckpoints.length).fill(false));
    drawPath.value = Skia.Path.Make(); // clear previous path
  }, [currentPart]);

  // Move to next part
  const handleNextPart = () => {
    if (currentPart < svgStrings.length - 1) {
      setCurrentPart(currentPart + 1);
    }
  };

  // Reset drawing and checkpoints
  const reset = () => {
    drawPath.value = Skia.Path.Make();
    setCurrentPart(0);
  };

  // Update visited checkpoints based on gesture
  const updateVisitedCheckpoints = (x: number, y: number) => {
    setVisitedCheckpoints((prev) => {
      const updated = [...prev];
      checkpoints.forEach((cp, index) => {
        const dx = x - cp.x;
        const dy = y - cp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
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

  // Gesture handling
  const gesture = Gesture.Pan()
    .onBegin((event) => {
      drawPath.value.moveTo(event.x, event.y);
      drawPath.modify();
    })
    .onChange((event) => {
      drawPath.value.lineTo(event.x, event.y);
      drawPath.modify();
      runOnJS(updateVisitedCheckpoints)(event.x, event.y);
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ flex: 1 }}>
          <Fill color="#49EDFF" />

          {/* Display all path parts */}
          {svgStrings.map((svg, index) => (
            <Path
              key={index}
              path={Skia.Path.MakeFromSVGString(svg)!}
              color={
                index < currentPart
                  ? "#FA00FF"
                  : index === currentPart
                  ? "black"
                  : "white"
              }
            />
          ))}

          {/* Mask for current part */}
          <Mask
            mask={
              <Path
                path={drawPath}
                color="black"
                strokeWidth={50}
                style="stroke"
              />
            }
          >
            <Path
              path={Skia.Path.MakeFromSVGString(svgStrings[currentPart])!}
              color="#FA00FF"
            />
          </Mask>

          {/* Optional: Visualize checkpoints */}
          {checkpoints.map((pt, index) => (
            <Path
              key={`cp-${index}`}
              path={Skia.Path.Make().addCircle(pt.x, pt.y, 5)}
              color={visitedCheckpoints[index] ? "green" : "red"}
            />
          ))}
        </Canvas>
      </GestureDetector>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        <Button title="Reset" onPress={reset} />
        <Button title="Next Part" onPress={handleNextPart} />
      </View>
    </GestureHandlerRootView>
  );
};

export default Tracing;