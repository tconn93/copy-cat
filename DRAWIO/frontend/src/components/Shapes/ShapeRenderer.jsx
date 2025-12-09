import { Rect, Circle, Line, Arrow, Text, Transformer } from 'react-konva';
import { useRef, useEffect } from 'react';
import { SHAPE_TYPES } from '../../constants/shapeTypes';

export function ShapeRenderer({ shape, isSelected, onSelect, onChange }) {
  const shapeRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e) => {
    onChange({
      ...shape,
      x: e.target.x(),
      y: e.target.y(),
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

    if (shape.type === SHAPE_TYPES.RECTANGLE || shape.type === SHAPE_TYPES.DIAMOND) {
      updates.width = Math.max(5, node.width() * scaleX);
      updates.height = Math.max(5, node.height() * scaleY);
    } else if (shape.type === SHAPE_TYPES.CIRCLE) {
      updates.radius = Math.max(5, node.radius() * scaleX);
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
      case SHAPE_TYPES.RECTANGLE:
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
            rotation={shape.rotation || 0}
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
          />
        );

      case SHAPE_TYPES.DIAMOND:
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
            rotation={shape.rotation || 0}
          />
        );

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
          />
        );

      case SHAPE_TYPES.LINE:
        return (
          <Line
            {...commonProps}
            x={shape.x}
            y={shape.y}
            points={shape.points}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
          />
        );

      default:
        return null;
    }
  };

  const getTextPosition = () => {
    if (shape.type === SHAPE_TYPES.CIRCLE) {
      // Circles use center positioning, so offset by radius
      return {
        x: shape.x - shape.radius,
        y: shape.y - 7, // Center vertically (half of fontSize)
        width: shape.radius * 2,
      };
    } else if (shape.type === SHAPE_TYPES.RECTANGLE || shape.type === SHAPE_TYPES.DIAMOND) {
      // Rectangles and diamonds use top-left positioning
      return {
        x: shape.x,
        y: shape.y + shape.height / 2 - 7,
        width: shape.width,
      };
    } else {
      // Lines and arrows
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
      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
}
