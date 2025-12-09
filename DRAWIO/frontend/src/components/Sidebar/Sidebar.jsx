import { useState } from 'react';
import { useDiagram } from '../../store/DiagramContext';
import { SHAPE_CATEGORIES, CATEGORIZED_SHAPES, DEFAULT_SHAPE_PROPS } from '../../constants/shapeTypes';
import { PropertiesPanel } from './PropertiesPanel';
import './Sidebar.css';

let shapeCounter = 0;

export function Sidebar() {
  const { dispatch } = useDiagram();
  const [selectedCategory, setSelectedCategory] = useState(SHAPE_CATEGORIES.BASIC);

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

  return (
    <div className="sidebar">
      <h3>Shapes</h3>

      <div className="category-tabs">
        {Object.values(SHAPE_CATEGORIES).map((category) => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="shape-library">
        {CATEGORIZED_SHAPES[selectedCategory].map((shape) => (
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
