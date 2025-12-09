import { useDiagram } from '../../store/DiagramContext';
import './AlignmentTools.css';

export function AlignmentTools() {
  const { state, dispatch } = useDiagram();

  const selectedShapes = state.shapes.filter(s =>
    state.selectedShapeId === s.id
  );

  const hasSelection = selectedShapes.length > 0;

  const alignLeft = () => {
    if (!hasSelection) return;

    const minX = Math.min(...state.shapes.map(s => s.x));

    selectedShapes.forEach(shape => {
      dispatch({
        type: 'UPDATE_SHAPE',
        payload: {
          id: shape.id,
          updates: { x: minX },
        },
      });
    });
  };

  const alignCenter = () => {
    if (!hasSelection) return;

    const shapePositions = state.shapes.map(s => ({
      left: s.x,
      right: s.x + (s.width || s.radius * 2 || 100),
    }));

    const minX = Math.min(...shapePositions.map(s => s.left));
    const maxX = Math.max(...shapePositions.map(s => s.right));
    const centerX = (minX + maxX) / 2;

    selectedShapes.forEach(shape => {
      const shapeWidth = shape.width || shape.radius * 2 || 100;
      const newX = centerX - shapeWidth / 2;

      dispatch({
        type: 'UPDATE_SHAPE',
        payload: {
          id: shape.id,
          updates: { x: newX },
        },
      });
    });
  };

  const alignRight = () => {
    if (!hasSelection) return;

    const shapePositions = state.shapes.map(s => ({
      right: s.x + (s.width || s.radius * 2 || 100),
      width: s.width || s.radius * 2 || 100,
    }));

    const maxRight = Math.max(...shapePositions.map(s => s.right));

    selectedShapes.forEach(shape => {
      const shapeWidth = shape.width || shape.radius * 2 || 100;
      const newX = maxRight - shapeWidth;

      dispatch({
        type: 'UPDATE_SHAPE',
        payload: {
          id: shape.id,
          updates: { x: newX },
        },
      });
    });
  };

  const alignTop = () => {
    if (!hasSelection) return;

    const minY = Math.min(...state.shapes.map(s => s.y));

    selectedShapes.forEach(shape => {
      dispatch({
        type: 'UPDATE_SHAPE',
        payload: {
          id: shape.id,
          updates: { y: minY },
        },
      });
    });
  };

  const alignMiddle = () => {
    if (!hasSelection) return;

    const shapePositions = state.shapes.map(s => ({
      top: s.y,
      bottom: s.y + (s.height || s.radius * 2 || 60),
    }));

    const minY = Math.min(...shapePositions.map(s => s.top));
    const maxY = Math.max(...shapePositions.map(s => s.bottom));
    const centerY = (minY + maxY) / 2;

    selectedShapes.forEach(shape => {
      const shapeHeight = shape.height || shape.radius * 2 || 60;
      const newY = centerY - shapeHeight / 2;

      dispatch({
        type: 'UPDATE_SHAPE',
        payload: {
          id: shape.id,
          updates: { y: newY },
        },
      });
    });
  };

  const alignBottom = () => {
    if (!hasSelection) return;

    const shapePositions = state.shapes.map(s => ({
      bottom: s.y + (s.height || s.radius * 2 || 60),
      height: s.height || s.radius * 2 || 60,
    }));

    const maxBottom = Math.max(...shapePositions.map(s => s.bottom));

    selectedShapes.forEach(shape => {
      const shapeHeight = shape.height || shape.radius * 2 || 60;
      const newY = maxBottom - shapeHeight;

      dispatch({
        type: 'UPDATE_SHAPE',
        payload: {
          id: shape.id,
          updates: { y: newY },
        },
      });
    });
  };

  return (
    <div className="alignment-tools">
      <button
        className="align-button"
        onClick={alignLeft}
        disabled={!hasSelection}
        title="Align Left"
      >
        ⫣
      </button>
      <button
        className="align-button"
        onClick={alignCenter}
        disabled={!hasSelection}
        title="Align Center"
      >
        ⫤
      </button>
      <button
        className="align-button"
        onClick={alignRight}
        disabled={!hasSelection}
        title="Align Right"
      >
        ⫥
      </button>
      <div className="align-divider" />
      <button
        className="align-button"
        onClick={alignTop}
        disabled={!hasSelection}
        title="Align Top"
      >
        ⫦
      </button>
      <button
        className="align-button"
        onClick={alignMiddle}
        disabled={!hasSelection}
        title="Align Middle"
      >
        ⫧
      </button>
      <button
        className="align-button"
        onClick={alignBottom}
        disabled={!hasSelection}
        title="Align Bottom"
      >
        ⫨
      </button>
    </div>
  );
}
