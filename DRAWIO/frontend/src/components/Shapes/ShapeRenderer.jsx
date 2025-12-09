import { Rect, Circle, Line, Arrow, Text, Transformer, Ellipse, RegularPolygon, Star, Path } from 'react-konva';
import { useRef, useEffect } from 'react';
import { SHAPE_TYPES } from '../../constants/shapeTypes';
import { ConnectionPoints } from './ConnectionPoints';
import { SmartConnector } from './SmartConnector';

const GRID_SIZE = 10;

function snapToGrid(value) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

// Helper function to create polygon points
function createPolygonPoints(sides, radius) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    points.push(radius * Math.cos(angle), radius * Math.sin(angle));
  }
  return points;
}

export function ShapeRenderer({ shape, isSelected, onSelect, onChange }) {
  // Use SmartConnector component for connector and line shapes
  if (shape.type === SHAPE_TYPES.CONNECTOR || shape.type === SHAPE_TYPES.LINE) {
    return <SmartConnector connector={shape} isSelected={isSelected} onSelect={onSelect} />;
  }

  const shapeRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e) => {
    const x = e.target.x();
    const y = e.target.y();

    onChange({
      ...shape,
      x: snapToGrid(x),
      y: snapToGrid(y),
    });
  };

  const handleTransformEnd = (e) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const updates = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    };

    // Update dimensions based on shape type
    const rectTypes = [
      SHAPE_TYPES.RECTANGLE, SHAPE_TYPES.ROUNDED_RECT, SHAPE_TYPES.PROCESS,
      SHAPE_TYPES.DATA, SHAPE_TYPES.TERMINAL, SHAPE_TYPES.PREPARATION,
      SHAPE_TYPES.DOCUMENT, SHAPE_TYPES.STORED_DATA, SHAPE_TYPES.CLASS, SHAPE_TYPES.NOTE
    ];

    const diamondTypes = [SHAPE_TYPES.DIAMOND, SHAPE_TYPES.DECISION];
    const triangleType = [SHAPE_TYPES.TRIANGLE];

    if (rectTypes.includes(shape.type) || diamondTypes.includes(shape.type) || triangleType.includes(shape.type)) {
      updates.width = Math.max(20, (shape.width || 100) * scaleX);
      updates.height = Math.max(20, (shape.height || 60) * scaleY);
    } else if (shape.type === SHAPE_TYPES.CIRCLE) {
      updates.radius = Math.max(10, shape.radius * scaleX);
    } else if (shape.type === SHAPE_TYPES.ELLIPSE) {
      updates.radiusX = Math.max(10, shape.radiusX * scaleX);
      updates.radiusY = Math.max(10, shape.radiusY * scaleY);
    } else if ([SHAPE_TYPES.PENTAGON, SHAPE_TYPES.HEXAGON, SHAPE_TYPES.STAR].includes(shape.type)) {
      updates.radius = Math.max(20, shape.radius * scaleX);
    } else if (shape.type === SHAPE_TYPES.ACTOR) {
      updates.width = Math.max(30, shape.width * scaleX);
      updates.height = Math.max(50, shape.height * scaleY);
    }

    onChange({
      ...shape,
      ...updates,
    });
  };

  const commonProps = {
    onClick: onSelect,
    onTap: onSelect,
    ref: shapeRef,
    draggable: true,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  const renderShape = () => {
    switch (shape.type) {
      // Basic Shapes
      case SHAPE_TYPES.RECTANGLE:
      case SHAPE_TYPES.PROCESS:
        return (
          <Rect
            {...commonProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            cornerRadius={shape.cornerRadius || 0}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.ROUNDED_RECT:
      case SHAPE_TYPES.TERMINAL:
        return (
          <Rect
            {...commonProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            cornerRadius={shape.cornerRadius || (shape.height / 2)}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.CIRCLE:
        return (
          <Circle
            {...commonProps}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.ELLIPSE:
        return (
          <Ellipse
            {...commonProps}
            x={shape.x + (shape.radiusX || 60)}
            y={shape.y + (shape.radiusY || 40)}
            radiusX={shape.radiusX}
            radiusY={shape.radiusY}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.TRIANGLE:
        const trianglePoints = [
          shape.width / 2, 0,
          shape.width, shape.height,
          0, shape.height,
        ];
        return (
          <Line
            {...commonProps}
            x={shape.x}
            y={shape.y}
            points={trianglePoints}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            closed={true}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.DIAMOND:
      case SHAPE_TYPES.DECISION:
        const diamondPoints = [
          shape.width / 2, 0,
          shape.width, shape.height / 2,
          shape.width / 2, shape.height,
          0, shape.height / 2,
        ];
        return (
          <Line
            {...commonProps}
            x={shape.x}
            y={shape.y}
            points={diamondPoints}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            closed={true}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.PENTAGON:
        return (
          <RegularPolygon
            {...commonProps}
            x={shape.x + (shape.radius || 50)}
            y={shape.y + (shape.radius || 50)}
            sides={5}
            radius={shape.radius}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.HEXAGON:
      case SHAPE_TYPES.PREPARATION:
        return (
          <RegularPolygon
            {...commonProps}
            x={shape.x + (shape.radius || shape.width / 2 || 60)}
            y={shape.y + (shape.radius || shape.height / 2 || 30)}
            sides={6}
            radius={shape.radius || (shape.width / 2) || 50}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.STAR:
        return (
          <Star
            {...commonProps}
            x={shape.x + (shape.radius || 50)}
            y={shape.y + (shape.radius || 50)}
            numPoints={5}
            innerRadius={shape.radius * 0.4}
            outerRadius={shape.radius}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      // Flowchart Shapes
      case SHAPE_TYPES.DATA:
        const dataPoints = [
          20, 0,
          shape.width, 0,
          shape.width - 20, shape.height,
          0, shape.height,
        ];
        return (
          <Line
            {...commonProps}
            x={shape.x}
            y={shape.y}
            points={dataPoints}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            closed={true}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.DOCUMENT:
        // Document with wavy bottom
        const docPath = `M 0 0 L ${shape.width} 0 L ${shape.width} ${shape.height - 10}
          Q ${shape.width * 0.75} ${shape.height - 5} ${shape.width * 0.5} ${shape.height - 10}
          Q ${shape.width * 0.25} ${shape.height - 15} 0 ${shape.height - 10} Z`;
        return (
          <Path
            {...commonProps}
            x={shape.x}
            y={shape.y}
            data={docPath}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      case SHAPE_TYPES.STORED_DATA:
        // Cylinder shape
        return (
          <Path
            {...commonProps}
            x={shape.x}
            y={shape.y}
            data={`M 10 0 L ${shape.width} 0 Q ${shape.width + 10} ${shape.height / 2} ${shape.width} ${shape.height}
              L 10 ${shape.height} Q 0 ${shape.height / 2} 10 0 Z`}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      // UML Shapes
      case SHAPE_TYPES.CLASS:
        return (
          <>
            <Rect
              {...commonProps}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              fill={shape.fill}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              shadowBlur={shape.shadowBlur || 0}
              shadowColor={shape.shadowColor}
              opacity={shape.opacity !== undefined ? shape.opacity : 1}
            />
            <Line
              points={[shape.x, shape.y + shape.height / 3, shape.x + shape.width, shape.y + shape.height / 3]}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              listening={false}
            />
            <Line
              points={[shape.x, shape.y + 2 * shape.height / 3, shape.x + shape.width, shape.y + 2 * shape.height / 3]}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              listening={false}
            />
          </>
        );

      case SHAPE_TYPES.ACTOR:
        // Stick figure
        const headRadius = shape.width / 4;
        const bodyStart = shape.y + headRadius * 2.5;
        const bodyEnd = bodyStart + shape.height * 0.4;
        const armY = bodyStart + (bodyEnd - bodyStart) * 0.3;
        const legEnd = shape.y + shape.height;

        return (
          <>
            <Circle
              {...commonProps}
              x={shape.x + shape.width / 2}
              y={shape.y + headRadius}
              radius={headRadius}
              fill="transparent"
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              shadowBlur={shape.shadowBlur || 0}
              shadowColor={shape.shadowColor}
              opacity={shape.opacity !== undefined ? shape.opacity : 1}
            />
            <Line
              points={[
                shape.x + shape.width / 2, bodyStart,
                shape.x + shape.width / 2, bodyEnd
              ]}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              listening={false}
            />
            <Line
              points={[
                shape.x, armY,
                shape.x + shape.width, armY
              ]}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              listening={false}
            />
            <Line
              points={[
                shape.x + shape.width / 2, bodyEnd,
                shape.x, legEnd
              ]}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              listening={false}
            />
            <Line
              points={[
                shape.x + shape.width / 2, bodyEnd,
                shape.x + shape.width, legEnd
              ]}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              listening={false}
            />
          </>
        );

      case SHAPE_TYPES.NOTE:
        const foldSize = 15;
        const notePoints = [
          0, 0,
          shape.width - foldSize, 0,
          shape.width - foldSize, foldSize,
          shape.width, foldSize,
          shape.width, shape.height,
          0, shape.height,
        ];
        return (
          <>
            <Line
              {...commonProps}
              x={shape.x}
              y={shape.y}
              points={notePoints}
              fill={shape.fill}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              closed={true}
              shadowBlur={shape.shadowBlur || 0}
              shadowColor={shape.shadowColor}
              opacity={shape.opacity !== undefined ? shape.opacity : 1}
            />
            <Line
              points={[
                shape.x + shape.width - foldSize, shape.y,
                shape.x + shape.width - foldSize, shape.y + foldSize,
                shape.x + shape.width, shape.y + foldSize
              ]}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              listening={false}
            />
          </>
        );

      // Connectors
      case SHAPE_TYPES.ARROW:
        return (
          <Arrow
            {...commonProps}
            x={shape.x}
            y={shape.y}
            points={shape.points}
            fill={shape.fill}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            pointerLength={shape.pointerLength}
            pointerWidth={shape.pointerWidth}
            shadowBlur={shape.shadowBlur || 0}
            shadowColor={shape.shadowColor}
            opacity={shape.opacity !== undefined ? shape.opacity : 1}
          />
        );

      default:
        return null;
    }
  };

  const getTextPosition = () => {
    if (shape.type === SHAPE_TYPES.CIRCLE) {
      return {
        x: shape.x - shape.radius,
        y: shape.y - 7,
        width: shape.radius * 2,
      };
    } else if (shape.type === SHAPE_TYPES.ELLIPSE) {
      return {
        x: shape.x,
        y: shape.y + shape.radiusY - 7,
        width: shape.radiusX * 2,
      };
    } else if ([SHAPE_TYPES.PENTAGON, SHAPE_TYPES.HEXAGON, SHAPE_TYPES.STAR].includes(shape.type)) {
      return {
        x: shape.x,
        y: shape.y + shape.radius - 7,
        width: shape.radius * 2,
      };
    } else if (shape.width && shape.height) {
      return {
        x: shape.x,
        y: shape.y + shape.height / 2 - 7,
        width: shape.width,
      };
    } else {
      return {
        x: shape.x,
        y: shape.y - 20,
        width: 100,
      };
    }
  };

  const textPos = getTextPosition();

  return (
    <>
      {renderShape()}
      {shape.text && (
        <Text
          x={textPos.x}
          y={textPos.y}
          text={shape.text}
          fontSize={14}
          fill="#000000"
          width={textPos.width}
          align="center"
          listening={false}
        />
      )}
      {isSelected && (
        <>
          <Transformer ref={transformerRef} />
          <ConnectionPoints shape={shape} />
        </>
      )}
    </>
  );
}
