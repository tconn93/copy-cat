import { useDiagram } from '../../store/DiagramContext';
import { SHAPE_TYPES, DEFAULT_SHAPE_PROPS } from '../../constants/shapeTypes';
import { PropertiesPanel } from './PropertiesPanel';
import './Sidebar.css';

let shapeCounter = 0;

export function Sidebar() {
  const { dispatch } = useDiagram();

  const addShape = (type) => {
    const defaultProps = DEFAULT_SHAPE_PROPS[type];
    shapeCounter++;
    const newShape = {
      id: `shape-${Date.now()}-${shapeCounter}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      x: 200,
      y: 150,
      ...defaultProps,
      text: '',
    };

    dispatch({ type: 'ADD_SHAPE', payload: newShape });
  };

  const shapes = [
    { type: SHAPE_TYPES.RECTANGLE, name: 'Rectangle', icon: '▭' },
    { type: SHAPE_TYPES.CIRCLE, name: 'Circle', icon: '○' },
    { type: SHAPE_TYPES.DIAMOND, name: 'Diamond', icon: '◇' },
    { type: SHAPE_TYPES.ARROW, name: 'Arrow', icon: '→' },
    { type: SHAPE_TYPES.LINE, name: 'Line', icon: '─' },
  ];

  return (
    <div className="sidebar">
      <h3>Shapes</h3>
      <div className="shape-library">
        {shapes.map((shape) => (
          <button
            key={shape.type}
            className="shape-button"
            onClick={() => addShape(shape.type)}
            title={`Add ${shape.name}`}
          >
            <span className="shape-icon">{shape.icon}</span>
            <span className="shape-name">{shape.name}</span>
          </button>
        ))}
      </div>
      <PropertiesPanel />
    </div>
  );
}
