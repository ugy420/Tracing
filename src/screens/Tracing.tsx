import { Canvas, Fill, Mask, Path, Skia, Morphology } from "@shopify/react-native-skia";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { useState } from "react";
import { View, Button } from "react-native";

const Tracing = () => {
  const svgStrings = [
    `M76.65,6.86l-.39-.25-14.96,24.21c-.62-.94-1.55-1.4-2.76-1.4-2.38,0-4.76,1.55-7.14,4.67-2.39,3.12-4.81,7.01-7.29,11.68-2.47,4.67-5.04,9.71-7.69,15.12-2.66,5.4-5.32,10.44-7.97,15.12-2.66,4.67-5.41,8.56-8.25,11.68-2.84,3.12-5.73,4.67-8.66,4.67-4.22,0-7.19-1.19-8.93-3.57-1.75-2.38-2.61-5.59-2.61-9.62s.86-9.12,2.61-14.71c1.74-5.59,4.03-11.31,6.87-17.18,2.84-5.86,6.14-11.63,9.89-17.32,3.76-5.67,7.61-10.71,11.55-15.11,3.94-4.4,7.83-7.97,11.68-10.72S50.02,0,53.32,0c1.47,0,3.25.1,5.36.28,2.11.18,4.26.55,6.46,1.1,2.2.55,4.35,1.28,6.46,2.2,2.08.91,3.77,2,5.05,3.28Z`,
    `M97.85,26.39c-1.47,0-2.8.87-3.99,2.61-1.19,1.75-2.24,3.85-3.16,6.32-.92,2.48-1.65,5.05-2.2,7.7-.55,2.66-.82,4.81-.82,6.46,0,12.64-.27,23.36-.82,32.16-.55,8.8-1.56,15.94-3.03,21.44-1.47,5.5-3.53,9.48-6.18,11.96-2.66,2.47-6.1,3.71-10.31,3.71-1.28,0-2.52-.64-3.71-1.93-1.2-1.28-2.25-2.93-3.16-4.94-.92-2.02-1.65-4.17-2.2-6.46s-.83-4.44-.83-6.46c0-16.68.83-30.19,2.48-40.55,1.65-10.35,2.47-17.91,2.47-22.67,0-2.23-.36-3.87-1.08-4.92l.84.52,14.96-24.2-.42-.26c3.3-2.57,7.05-4.35,11.26-5.36,2.66-.64,5.8-1.08,9.4-1.31v26.18h.5Z`,
    `M160.25,217.98c0,2.74-1.15,6.18-3.44,10.3-2.29,4.13-5.18,8.11-8.66,11.96-3.48,3.85-7.38,7.1-11.68,9.76-4.31,2.66-8.48,3.98-12.51,3.98-3.11,0-4.99-.31-5.63-.96-.65-.64-.96-2.52-.96-5.63v-100.61c0-17.59-.14-33.76-.42-48.51-.27-14.75-1.01-27.44-2.2-38.07-1.19-10.62-3.11-18.92-5.77-24.88-2.66-5.95-6.37-8.93-11.13-8.93h.5V.15c1.83-.1,3.76-.15,5.82-.15,6.6,0,12.14,2.11,16.63,6.33,4.49,4.21,8.2,9.94,11.13,17.18,2.93,7.24,5.23,15.66,6.88,25.28,1.65,9.62,2.83,19.79,3.57,30.51.73,10.72,1.14,21.72,1.24,32.99.09,11.27.13,22.13.13,32.57v77.24c3.12-2.57,5.82-4.31,8.11-5.22,2.29-.92,3.99-1.38,5.09-1.38.91,0,1.69.19,2.33.55.64.37.97,1.01.97,1.93Z`
  ];

  const [currentPart, setCurrentPart] = useState(0);
  const drawPath = useSharedValue(Skia.Path.Make());
  
  const gesture = Gesture.Pan()
    .onBegin((event) => {
      drawPath.value.moveTo(event.x, event.y);
      drawPath.modify();
    })
    .onChange((event) => {
      drawPath.value.lineTo(event.x, event.y);
      drawPath.modify();
      console.log("Drawing", event.x, event.y);
    });

  const handleNextPart = () => {
    if (currentPart < svgStrings.length - 1) {
      setCurrentPart(currentPart + 1);
      drawPath.value = Skia.Path.Make();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ flex: 1 }}>
          <Fill color="#49EDFF"/>
          {svgStrings.map((svg, index) => (
            <Path
              key={index}
              path={Skia.Path.MakeFromSVGString(svg)!}
              color={index < currentPart ? "#FA00FF" : index==currentPart ? "black" : "white"} 
            />
          ))}
          <Mask mask={<Path path={drawPath} color="black" strokeWidth={40} style="stroke" />}>
            <Path path={Skia.Path.MakeFromSVGString(svgStrings[currentPart])!} color="#FA00FF" />
          </Mask>
        </Canvas>
      </GestureDetector>
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
        <Button title="Reset" onPress={() => (setCurrentPart(0))} />
        <Button title="Next Part" onPress={handleNextPart}/>
      </View>
    </GestureHandlerRootView>
  );
};

export default Tracing;