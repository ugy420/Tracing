import {Canvas, Group, Path, Skia, SkPoint} from '@shopify/react-native-skia';
import React from 'react';
import {StyleSheet} from 'react-native';

const RenderCompletedCharacter = React.memo(
  ({
    svgString,
    completedCheckpoints,
  }: {
    svgString: string;
    completedCheckpoints: SkPoint[][];
  }) => {
    return (
      <Canvas style={styles.container}>
        <Group>
          {/* Main character */}
          <Path
            path={Skia.Path.MakeFromSVGString(svgString)!}
            color="#4CAF50" // Green color for completed character
            style="stroke"
            strokeWidth={4}
          />

          {/* Render all checkpoints as a single path */}
          {completedCheckpoints.map((partCheckpoints, partIndex) => {
            const path = Skia.Path.Make();
            partCheckpoints.forEach(pt => {
              path.addCircle(pt.x, pt.y, 5); // Add all checkpoints to a single path
            });
            return (
              <Path
                key={`completed-part-${partIndex}`}
                path={path}
                color="#4CAF50" // Green color for completed checkpoints
              />
            );
          })}
        </Group>
      </Canvas>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default RenderCompletedCharacter;
