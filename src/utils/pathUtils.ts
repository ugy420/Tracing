const isPointNearPath = (x: number, y: number, path: SkiaPath, threshold = 20): boolean => {
  // Sample along the path and check distance to the point (approximation)
  const pathLength = path.getLength();
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const pos = path.getPoint(pathLength * (i / steps));
    const dx = pos.x - x;
    const dy = pos.y - y;
    const distSq = dx * dx + dy * dy;
    if (distSq < threshold * threshold) return true;
  }
  return false;
};