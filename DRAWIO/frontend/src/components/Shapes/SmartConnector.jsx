import { useRef, useState, useEffect } from 'react';
import { Line, Arrow, Circle, Group } from 'react-konva';
import { useDiagram } from '../../store/DiagramContext';
import {
  calculateConnectorPoints,
  findNearestAnchor,
  SNAP_DISTANCE,
} from '../../utils/connectorUtils';
import { SHAPE_TYPES } from '../../constants/shapeTypes';

export function SmartConnector({ connector, isSelected, onSelect }) {
  const { state, dispatch } = useDiagram();
  const lineRef = useRef();
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [tempPoints, setTempPoints] = useState(null);

  // Calculate actual points based on connections
  const points = calculateConnectorPoints(connector, state.shapes);
  const displayPoints = tempPoints || [
    points.startX,
    points.startY,
    points.endX,
    points.endY,
  ];

  // Handle dragging start endpoint
  const handleStartDragMove = (e) => {
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();

    // Account for layer transformations
    const layer = e.target.getLayer();
    const layerTransform = layer.getAbsoluteTransform().copy().invert();
    const localPos = layerTransform.point(pointerPos);

    setTempPoints([localPos.x, localPos.y, displayPoints[2], displayPoints[3]]);
  };

  const handleStartDragEnd = (e) => {
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();

    // Account for layer transformations
    const layer = e.target.getLayer();
    const layerTransform = layer.getAbsoluteTransform().copy().invert();
    const localPos = layerTransform.point(pointerPos);

    // Find nearest shape and anchor
    let nearestShape = null;
    let nearestAnchor = null;
    let minDistance = SNAP_DISTANCE;

    state.shapes.forEach((shape) => {
      if (
        shape.type !== SHAPE_TYPES.LINE &&
        shape.type !== SHAPE_TYPES.ARROW &&
        shape.type !== SHAPE_TYPES.CONNECTOR &&
        shape.id !== connector.id
      ) {
        const { anchor, distance } = findNearestAnchor(shape, localPos.x, localPos.y);
        if (distance < minDistance) {
          minDistance = distance;
          nearestShape = shape;
          nearestAnchor = anchor;
        }
      }
    });

    // Update connector
    const updates = {
      startShapeId: nearestShape ? nearestShape.id : null,
      startAnchor: nearestAnchor,
      points: nearestShape
        ? connector.points
        : [localPos.x - connector.x, localPos.y - connector.y, connector.points[2], connector.points[3]],
    };

    dispatch({
      type: 'UPDATE_SHAPE',
      payload: { id: connector.id, updates },
    });

    setIsDraggingStart(false);
    setTempPoints(null);
  };

  // Handle dragging end endpoint
  const handleEndDragMove = (e) => {
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();

    // Account for layer transformations
    const layer = e.target.getLayer();
    const layerTransform = layer.getAbsoluteTransform().copy().invert();
    const localPos = layerTransform.point(pointerPos);

    setTempPoints([displayPoints[0], displayPoints[1], localPos.x, localPos.y]);
  };

  const handleEndDragEnd = (e) => {
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();

    // Account for layer transformations
    const layer = e.target.getLayer();
    const layerTransform = layer.getAbsoluteTransform().copy().invert();
    const localPos = layerTransform.point(pointerPos);

    // Find nearest shape and anchor
    let nearestShape = null;
    let nearestAnchor = null;
    let minDistance = SNAP_DISTANCE;

    state.shapes.forEach((shape) => {
      if (
        shape.type !== SHAPE_TYPES.LINE &&
        shape.type !== SHAPE_TYPES.ARROW &&
        shape.type !== SHAPE_TYPES.CONNECTOR &&
        shape.id !== connector.id
      ) {
        const { anchor, distance } = findNearestAnchor(shape, localPos.x, localPos.y);
        if (distance < minDistance) {
          minDistance = distance;
          nearestShape = shape;
          nearestAnchor = anchor;
        }
      }
    });

    // Update connector
    const updates = {
      endShapeId: nearestShape ? nearestShape.id : null,
      endAnchor: nearestAnchor,
      points: nearestShape
        ? connector.points
        : [connector.points[0], connector.points[1], localPos.x - connector.x, localPos.y - connector.y],
    };

    dispatch({
      type: 'UPDATE_SHAPE',
      payload: { id: connector.id, updates },
    });

    setIsDraggingEnd(false);
    setTempPoints(null);
  };

  // Render the connector line
  const ConnectorLine =
    connector.type === SHAPE_TYPES.ARROW || connector.type === SHAPE_TYPES.CONNECTOR
      ? Arrow
      : Line;

  return (
    <Group>
      <ConnectorLine
        ref={lineRef}
        points={displayPoints}
        stroke={connector.stroke || '#000000'}
        strokeWidth={connector.strokeWidth || 2}
        onClick={onSelect}
        onTap={onSelect}
        listening={!isDraggingStart && !isDraggingEnd}
        pointerLength={connector.pointerLength || 10}
        pointerWidth={connector.pointerWidth || 10}
        shadowBlur={connector.shadowBlur || 0}
        shadowColor={connector.shadowColor}
        opacity={connector.opacity !== undefined ? connector.opacity : 1}
      />

      {/* Start endpoint handle */}
      {isSelected && (
        <Circle
          x={displayPoints[0]}
          y={displayPoints[1]}
          radius={6}
          fill="#2196F3"
          stroke="#ffffff"
          strokeWidth={2}
          draggable
          onDragMove={handleStartDragMove}
          onDragEnd={handleStartDragEnd}
          onDragStart={() => setIsDraggingStart(true)}
        />
      )}

      {/* End endpoint handle */}
      {isSelected && (
        <Circle
          x={displayPoints[2]}
          y={displayPoints[3]}
          radius={6}
          fill="#2196F3"
          stroke="#ffffff"
          strokeWidth={2}
          draggable
          onDragMove={handleEndDragMove}
          onDragEnd={handleEndDragEnd}
          onDragStart={() => setIsDraggingEnd(true)}
        />
      )}
    </Group>
  );
}
