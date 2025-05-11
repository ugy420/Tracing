import {Skia, SkPath} from '@shopify/react-native-skia';

const centerPath = (
  path: SkPath,
  canvasWidth: number,
  canvasHeight: number,
): SkPath => {
  const bounds = path.getBounds();
  const dx = (canvasWidth - bounds.width) / 2 - bounds.x;
  const dy = (canvasHeight - bounds.height) / 2 - bounds.y;

  const centeredPath = Skia.Path.Make();
  centeredPath.addPath(path, Skia.Matrix().translate(dx, dy));
  return centeredPath;
};

export default centerPath;
