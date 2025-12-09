import { Layer, Rect, Line, Text } from 'react-konva';
import { useDiagram } from '../../store/DiagramContext';
import { useState } from 'react';

const RULER_SIZE = 30;
const MAJOR_TICK = 100; // Major tick every 100px
const MINOR_TICK = 50; // Minor tick every 50px
const MICRO_TICK = 10; // Micro tick every 10px

export function Rulers({ width, height }) {
  const { state, dispatch } = useDiagram();
  const { scale, position } = state;
  const [isDraggingGuide, setIsDraggingGuide] = useState(false);

  const handleRulerDragStart = (type) => {
    setIsDraggingGuide(true);
  };

  const handleRulerDragMove = (type, e) => {
    // Guide will be created on drag end
  };

  const handleRulerDragEnd = (type, e) => {
    setIsDraggingGuide(false);

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();

    // Only create guide if dragged beyond the ruler
    if (type === 'horizontal' && pointerPos.y > RULER_SIZE) {
      const position = (pointerPos.y - state.position.y) / state.scale;
      dispatch({
        type: 'ADD_GUIDE',
        payload: {
          id: `guide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'horizontal',
          position,
        },
      });
    } else if (type === 'vertical' && pointerPos.x > RULER_SIZE) {
      const position = (pointerPos.x - state.position.x) / state.scale;
      dispatch({
        type: 'ADD_GUIDE',
        payload: {
          id: `guide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'vertical',
          position,
        },
      });
    }
  };

  const renderHorizontalRuler = () => {
    const elements = [];

    // Background
    elements.push(
      <Rect
        key="h-bg"
        x={0}
        y={0}
        width={width}
        height={RULER_SIZE}
        fill="#f0f0f0"
        strokeWidth={1}
        stroke="#ccc"
      />
    );

    // Calculate visible range
    const startX = -position.x / scale;
    const endX = (width - position.x) / scale;

    // Render ticks
    for (let x = Math.floor(startX / MICRO_TICK) * MICRO_TICK; x <= endX; x += MICRO_TICK) {
      const screenX = x * scale + position.x;

      if (screenX < RULER_SIZE || screenX > width) continue;

      let tickHeight = 5;
      let showLabel = false;

      if (x % MAJOR_TICK === 0) {
        tickHeight = 15;
        showLabel = true;
      } else if (x % MINOR_TICK === 0) {
        tickHeight = 10;
      }

      elements.push(
        <Line
          key={`h-tick-${x}`}
          points={[screenX, RULER_SIZE - tickHeight, screenX, RULER_SIZE]}
          stroke="#666"
          strokeWidth={1}
        />
      );

      if (showLabel) {
        elements.push(
          <Text
            key={`h-label-${x}`}
            x={screenX + 2}
            y={2}
            text={Math.abs(x).toString()}
            fontSize={10}
            fill="#333"
          />
        );
      }
    }

    return elements;
  };

  const renderVerticalRuler = () => {
    const elements = [];

    // Background
    elements.push(
      <Rect
        key="v-bg"
        x={0}
        y={0}
        width={RULER_SIZE}
        height={height}
        fill="#f0f0f0"
        strokeWidth={1}
        stroke="#ccc"
      />
    );

    // Calculate visible range
    const startY = -position.y / scale;
    const endY = (height - position.y) / scale;

    // Render ticks
    for (let y = Math.floor(startY / MICRO_TICK) * MICRO_TICK; y <= endY; y += MICRO_TICK) {
      const screenY = y * scale + position.y;

      if (screenY < RULER_SIZE || screenY > height) continue;

      let tickWidth = 5;
      let showLabel = false;

      if (y % MAJOR_TICK === 0) {
        tickWidth = 15;
        showLabel = true;
      } else if (y % MINOR_TICK === 0) {
        tickWidth = 10;
      }

      elements.push(
        <Line
          key={`v-tick-${y}`}
          points={[RULER_SIZE - tickWidth, screenY, RULER_SIZE, screenY]}
          stroke="#666"
          strokeWidth={1}
        />
      );

      if (showLabel) {
        elements.push(
          <Text
            key={`v-label-${y}`}
            x={2}
            y={screenY + 2}
            text={Math.abs(y).toString()}
            fontSize={10}
            fill="#333"
          />
        );
      }
    }

    return elements;
  };

  return (
    <Layer>
      {/* Horizontal ruler (top) */}
      {renderHorizontalRuler()}

      {/* Vertical ruler (left) */}
      {renderVerticalRuler()}

      {/* Draggable area for horizontal guide creation */}
      <Rect
        x={RULER_SIZE}
        y={0}
        width={width - RULER_SIZE}
        height={RULER_SIZE}
        fill="transparent"
        draggable
        onDragStart={() => handleRulerDragStart('horizontal')}
        onDragMove={(e) => handleRulerDragMove('horizontal', e)}
        onDragEnd={(e) => handleRulerDragEnd('horizontal', e)}
        dragBoundFunc={(pos) => ({ x: pos.x, y: pos.y })}
      />

      {/* Draggable area for vertical guide creation */}
      <Rect
        x={0}
        y={RULER_SIZE}
        width={RULER_SIZE}
        height={height - RULER_SIZE}
        fill="transparent"
        draggable
        onDragStart={() => handleRulerDragStart('vertical')}
        onDragMove={(e) => handleRulerDragMove('vertical', e)}
        onDragEnd={(e) => handleRulerDragEnd('vertical', e)}
        dragBoundFunc={(pos) => ({ x: pos.x, y: pos.y })}
      />

      {/* Corner square */}
      <Rect
        x={0}
        y={0}
        width={RULER_SIZE}
        height={RULER_SIZE}
        fill="#e0e0e0"
        strokeWidth={1}
        stroke="#ccc"
      />
    </Layer>
  );
}

export { RULER_SIZE };
