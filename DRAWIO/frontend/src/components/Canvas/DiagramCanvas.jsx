import { Stage, Layer, Line, Circle } from 'react-konva';
import { useState } from 'react';
import { useDiagram } from '../../store/DiagramContext';
import { ShapeRenderer } from '../Shapes/ShapeRenderer';
import { Rulers } from './Rulers';
import { Guides } from './Guides';

export function DiagramCanvas({ stageRef }) {
  const { state, dispatch } = useDiagram();
  const [isPanning, setIsPanning] = useState(false);

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = state.scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - state.position.x) / oldScale,
      y: (pointer.y - state.position.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;

    const clampedScale = Math.max(0.1, Math.min(5, newScale));

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    dispatch({
      type: 'UPDATE_CANVAS',
      payload: {
        scale: clampedScale,
        position: newPos,
      },
    });
  };

  const handleMouseDown = (e) => {
    // Only start panning if clicking on the stage (not on a shape)
    if (e.target === e.target.getStage()) {
      setIsPanning(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;

    const newPos = {
      x: state.position.x + e.evt.movementX,
      y: state.position.y + e.evt.movementY,
    };

    dispatch({
      type: 'UPDATE_CANVAS',
      payload: {
        position: newPos,
      },
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      dispatch({ type: 'DESELECT_SHAPE' });
    }
  };

  const handleShapeSelect = (id) => {
    dispatch({ type: 'SELECT_SHAPE', payload: id });
  };

  const handleShapeChange = (updatedShape) => {
    dispatch({
      type: 'UPDATE_SHAPE',
      payload: {
        id: updatedShape.id,
        updates: updatedShape,
      },
    });
  };

  const renderGrid = () => {
    const gridSize = 10;
    const dots = [];
    const width = window.innerWidth * 2;
    const height = window.innerHeight * 2;
    const offsetX = -window.innerWidth / 2;
    const offsetY = -window.innerHeight / 2;

    // Create dot grid pattern like draw.io
    for (let i = 0; i < width / gridSize; i++) {
      for (let j = 0; j < height / gridSize; j++) {
        dots.push(
          <Circle
            key={`dot-${i}-${j}`}
            x={offsetX + i * gridSize}
            y={offsetY + j * gridSize}
            radius={1}
            fill="#c0c0c0"
          />
        );
      }
    }

    return dots;
  };

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={handleWheel}
      onClick={handleStageClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer
        listening={false}
        scaleX={state.scale}
        scaleY={state.scale}
        x={state.position.x}
        y={state.position.y}
      >
        {renderGrid()}
      </Layer>
      <Layer
        scaleX={state.scale}
        scaleY={state.scale}
        x={state.position.x}
        y={state.position.y}
      >
        {state.shapes.map((shape) => (
          <ShapeRenderer
            key={shape.id}
            shape={shape}
            isSelected={shape.id === state.selectedShapeId}
            onSelect={() => handleShapeSelect(shape.id)}
            onChange={handleShapeChange}
          />
        ))}
      </Layer>
      <Guides />
      <Rulers width={window.innerWidth} height={window.innerHeight} />
    </Stage>
  );
}
