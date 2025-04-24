declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "point-in-polygon" {
  const pointInPolygon: (point: [number, number], polygon: [number, number][]) => boolean;
  export default pointInPolygon;
}