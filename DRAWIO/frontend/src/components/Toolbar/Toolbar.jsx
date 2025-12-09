import { useDiagram } from '../../store/DiagramContext';
import { MenuBar } from '../MenuBar/MenuBar';
import { AlignmentTools } from './AlignmentTools';
import './Toolbar.css';

export function Toolbar({ stageRef }) {
  const { state, dispatch } = useDiagram();

  const handleDelete = () => {
    if (state.selectedShapeId) {
      dispatch({ type: 'DELETE_SHAPE', payload: state.selectedShapeId });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all shapes?')) {
      dispatch({ type: 'CLEAR_ALL' });
    }
  };

  const handleZoomIn = () => {
    const newScale = Math.min(5, state.scale * 1.2);
    dispatch({
      type: 'UPDATE_CANVAS',
      payload: { scale: newScale },
    });
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.1, state.scale / 1.2);
    dispatch({
      type: 'UPDATE_CANVAS',
      payload: { scale: newScale },
    });
  };

  const handleResetZoom = () => {
    dispatch({
      type: 'UPDATE_CANVAS',
      payload: {
        scale: 1,
        position: { x: 0, y: 0 },
      },
    });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h2 className="toolbar-title">Tyler's Drawing Tool</h2>
      </div>

      <div className="toolbar-section">
        <MenuBar stageRef={stageRef} />
      </div>

      <div className="toolbar-section">
        <button
          className="toolbar-button"
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          className="toolbar-button"
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
      </div>

      <div className="toolbar-section">
        <AlignmentTools />
      </div>

      <div className="toolbar-section">
        <button
          className="toolbar-button"
          onClick={handleDelete}
          disabled={!state.selectedShapeId}
          title="Delete selected shape (Delete)"
        >
          🗑️ Delete
        </button>
        <button
          className="toolbar-button"
          onClick={handleClearAll}
          title="Clear all shapes"
        >
          🗑️ Clear All
        </button>
      </div>

      <div className="toolbar-section">
        <button
          className="toolbar-button"
          onClick={handleZoomOut}
          title="Zoom out"
        >
          🔍−
        </button>
        <span className="zoom-level">{Math.round(state.scale * 100)}%</span>
        <button
          className="toolbar-button"
          onClick={handleZoomIn}
          title="Zoom in"
        >
          🔍+
        </button>
        <button
          className="toolbar-button"
          onClick={handleResetZoom}
          title="Reset zoom"
        >
          ↺ Reset
        </button>
      </div>

      <div className="toolbar-section">
        <span className="toolbar-info">
          Shapes: {state.shapes.length}
        </span>
      </div>
    </div>
  );
}
