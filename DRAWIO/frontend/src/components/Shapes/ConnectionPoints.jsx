import { Circle } from 'react-konva';
import { CONNECTION_ANCHORS, SHAPE_TYPES } from '../../constants/shapeTypes';

export function ConnectionPoints({ shape }) {
  // Calculate the bounding box for the shape
  const getShapeBounds = () => {
    switch (shape.type) {
      case SHAPE_TYPES.CIRCLE:
        return {
          x: shape.x - shape.radius,
          y: shape.y - shape.radius,
          width: shape.radius * 2,
          height: shape.radius * 2,
        };

      case SHAPE_TYPES.ELLIPSE:
        return {
          x: shape.x - shape.radiusX,
          y: shape.y - shape.radiusY,
          width: shape.radiusX * 2,
          height: shape.radiusY * 2,
        };

      case SHAPE_TYPES.PENTAGON:
      case SHAPE_TYPES.HEXAGON:
      case SHAPE_TYPES.STAR:
        return {
          x: shape.x - shape.radius,
          y: shape.y - shape.radius,
          width: shape.radius * 2,
          height: shape.radius * 2,
        };

      case SHAPE_TYPES.TRIANGLE:
        return {
          x: shape.x - shape.width / 2,
          y: shape.y - shape.height / 2,
          width: shape.width,
          height: shape.height,
        };

      case SHAPE_TYPES.ACTOR:
        return {
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
        };

      // Default for rectangle-based shapes
      default:
        return {
          x: shape.x,
          y: shape.y,
          width: shape.width || 100,
          height: shape.height || 100,
        };
    }
  };

  const bounds = getShapeBounds();
  const anchorPoints = [];

  // Generate anchor points for each CONNECTION_ANCHORS position
  Object.entries(CONNECTION_ANCHORS).forEach(([name, anchor]) => {
    const x = bounds.x + bounds.width * anchor.x;
    const y = bounds.y + bounds.height * anchor.y;

    anchorPoints.push({
      name,
      x,
      y,
    });
  });

  return (
    <>
      {anchorPoints.map((point) => (
        <Circle
          key={point.name}
          x={point.x}
          y={point.y}
          radius={4}
          fill="#2196F3"
          stroke="#ffffff"
          strokeWidth={1}
          listening={false}
        />
      ))}
    </>
  );
}
