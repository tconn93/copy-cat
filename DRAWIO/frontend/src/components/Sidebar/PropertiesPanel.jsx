import { useDiagram } from '../../store/DiagramContext';
import './PropertiesPanel.css';

export function PropertiesPanel() {
  const { state, dispatch } = useDiagram();

  const selectedShape = state.shapes.find(s => s.id === state.selectedShapeId);

  if (!selectedShape) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p className="no-selection">No shape selected</p>
      </div>
    );
  }

  const handleTextChange = (e) => {
    dispatch({
      type: 'UPDATE_SHAPE',
      payload: {
        id: selectedShape.id,
        updates: { text: e.target.value },
      },
    });
  };

  const handleFillChange = (e) => {
    dispatch({
      type: 'UPDATE_SHAPE',
      payload: {
        id: selectedShape.id,
        updates: { fill: e.target.value },
      },
    });
  };

  const handleStrokeChange = (e) => {
    dispatch({
      type: 'UPDATE_SHAPE',
      payload: {
        id: selectedShape.id,
        updates: { stroke: e.target.value },
      },
    });
  };

  const handleStrokeWidthChange = (e) => {
    dispatch({
      type: 'UPDATE_SHAPE',
      payload: {
        id: selectedShape.id,
        updates: { strokeWidth: parseFloat(e.target.value) },
      },
    });
  };

  return (
    <div className="properties-panel">
      <h3>Properties</h3>

      <div className="property-group">
        <label>Text</label>
        <input
          type="text"
          value={selectedShape.text || ''}
          onChange={handleTextChange}
          placeholder="Enter text..."
        />
      </div>

      <div className="property-group">
        <label>Fill Color</label>
        <div className="color-input">
          <input
            type="color"
            value={selectedShape.fill || '#ffffff'}
            onChange={handleFillChange}
          />
          <input
            type="text"
            value={selectedShape.fill || '#ffffff'}
            onChange={handleFillChange}
            className="color-text"
          />
        </div>
      </div>

      <div className="property-group">
        <label>Stroke Color</label>
        <div className="color-input">
          <input
            type="color"
            value={selectedShape.stroke || '#000000'}
            onChange={handleStrokeChange}
          />
          <input
            type="text"
            value={selectedShape.stroke || '#000000'}
            onChange={handleStrokeChange}
            className="color-text"
          />
        </div>
      </div>

      <div className="property-group">
        <label>Stroke Width</label>
        <input
          type="range"
          min="1"
          max="10"
          value={selectedShape.strokeWidth || 2}
          onChange={handleStrokeWidthChange}
        />
        <span className="value-display">{selectedShape.strokeWidth || 2}px</span>
      </div>

      <div className="property-info">
        <small>Type: {selectedShape.type}</small>
      </div>
    </div>
  );
}
