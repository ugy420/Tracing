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

  const [checkpoints, setCheckpoints] = useState<SkPoint[]>([]);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<boolean[]>([]);
  const threshold = 30;

  // Shared value for guide points
  const guidePoints = useSharedValue<{ x: number; y: number }[]>([]);

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

  const generateGuidePoints = (svg: string, numPoints = 200): { x: number; y: number }[] => {
    const props = new svgPathProperties(svg);
    const total = props.getTotalLength();
    const result = [];
    for (let i = 0; i <= numPoints; i++) {
      const p = props.getPointAtLength((i / numPoints) * total);
      result.push({ x: p.x, y: p.y });
    }
    return result;
  };

  useEffect(() => {
    const newCheckpoints = generateCheckpoints(letter.guidePath[0]);
    setCheckpoints(newCheckpoints);
    setVisitedCheckpoints(Array(newCheckpoints.length).fill(false));
    drawPath.value = Skia.Path.Make();

    // Save guide points for gesture validation
    guidePoints.value = generateGuidePoints(letter.guidePath[0]);
  }, [currentPart]);

  const handleNextPart = () => {
    if (currentPart < svgStrings.length - 1) {
      setCurrentPart(currentPart + 1);
    }
  };

  const reset = () => {
    drawPath.value = Skia.Path.Make();
    setCurrentPart(0);
  };

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

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      const near = guidePoints.value.some((pt) => {
        const dx = pt.x - event.x;
        const dy = pt.y - event.y;
        return Math.sqrt(dx * dx + dy * dy) < threshold;
      });

      if (near) {
        drawPath.value.moveTo(event.x, event.y);
        drawPath.modify();
      }
    })
    .onChange((event) => {
      const near = guidePoints.value.some((pt) => {
        const dx = pt.x - event.x;
        const dy = pt.y - event.y;
        return Math.sqrt(dx * dx + dy * dy) < threshold;
      });

      if (near) {
        drawPath.value.lineTo(event.x, event.y);
        drawPath.modify();
        runOnJS(updateVisitedCheckpoints)(event.x, event.y);
      }
    });

  return (
    <View style={{ flex: 1, backgroundColor: "orange" }}>
      <Button title="Reset" onPress={reset} />
      <GestureHandlerRootView>
        <GestureDetector gesture={gesture}>
        <Canvas style={{ width: "25%", height: "90%", alignSelf: "center" }}>
  <Fill color="orange" />

  {svgStrings.map((svg, index) => (
    <Path
      key={index}
      path={Skia.Path.MakeFromSVGString(svg)!}
      color={
        index < currentPart
          ? "blue"
          : index === currentPart
          ? "white"
          : "white"
      }
    />
  ))}

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
      color="blue"
    />
  </Mask>

  {/* Checkpoints - red if not visited, green if visited */}
  {checkpoints.map((pt, index) => (
    <Path
      key={`cp-${index}`}
      path={Skia.Path.Make().addCircle(pt.x, pt.y, 5)}
      color={visitedCheckpoints[index] ? "green" : "red"}
    />
  ))}

  {/* Guide Points - yellow for testing */}
  {guidePoints.value.map((pt, index) => (
    <Path
      key={`guide-${index}`}
      path={Skia.Path.Make().addCircle(pt.x, pt.y, 2)}
      color="black"
    />
  ))}
</Canvas>

        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
};

export default Tracing;