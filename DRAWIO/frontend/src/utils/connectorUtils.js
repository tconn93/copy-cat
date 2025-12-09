import { CONNECTION_ANCHORS, SHAPE_TYPES } from '../constants/shapeTypes';

// Calculate the bounding box for a shape
export function getShapeBounds(shape) {
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

    default:
      return {
        x: shape.x,
        y: shape.y,
        width: shape.width || 100,
        height: shape.height || 100,
      };
  }
}

// Get the absolute position of an anchor point on a shape
export function getAnchorPosition(shape, anchorName) {
  const bounds = getShapeBounds(shape);
  const anchor = CONNECTION_ANCHORS[anchorName];

  if (!anchor) {
    return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  }

  return {
    x: bounds.x + bounds.width * anchor.x,
    y: bounds.y + bounds.height * anchor.y,
  };
}

// Find the nearest anchor point on a shape to a given position
export function findNearestAnchor(shape, x, y) {
  let nearestAnchor = null;
  let minDistance = Infinity;

  Object.keys(CONNECTION_ANCHORS).forEach((anchorName) => {
    const anchorPos = getAnchorPosition(shape, anchorName);
    const distance = Math.sqrt(
      Math.pow(anchorPos.x - x, 2) + Math.pow(anchorPos.y - y, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestAnchor = anchorName;
    }
  });

  return { anchor: nearestAnchor, distance: minDistance };
}

// Calculate connector points based on connected shapes
export function calculateConnectorPoints(connector, shapes) {
  let startX, startY, endX, endY;

  // Calculate start point
  if (connector.startShapeId && connector.startAnchor) {
    const startShape = shapes.find((s) => s.id === connector.startShapeId);
    if (startShape) {
      const startPos = getAnchorPosition(startShape, connector.startAnchor);
      startX = startPos.x;
      startY = startPos.y;
    } else {
      // Shape not found, use stored position
      startX = connector.points[0];
      startY = connector.points[1];
    }
  } else {
    // Not connected, use stored position
    startX = connector.x + connector.points[0];
    startY = connector.y + connector.points[1];
  }

  // Calculate end point
  if (connector.endShapeId && connector.endAnchor) {
    const endShape = shapes.find((s) => s.id === connector.endShapeId);
    if (endShape) {
      const endPos = getAnchorPosition(endShape, connector.endAnchor);
      endX = endPos.x;
      endY = endPos.y;
    } else {
      // Shape not found, use stored position
      endX = connector.points[2];
      endY = connector.points[3];
    }
  } else {
    // Not connected, use stored position
    endX = connector.x + connector.points[2];
    endY = connector.y + connector.points[3];
  }

  return { startX, startY, endX, endY };
}

// Snap distance threshold (in pixels)
export const SNAP_DISTANCE = 15;
