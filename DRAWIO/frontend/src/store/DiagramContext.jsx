import { createContext, useContext, useReducer } from 'react';

const DiagramContext = createContext();

const initialState = {
  shapes: [],
  selectedShapeId: null,
  scale: 1,
  position: { x: 0, y: 0 },
};

function diagramReducer(state, action) {
  switch (action.type) {
    case 'ADD_SHAPE':
      return {
        ...state,
        shapes: [...state.shapes, action.payload],
      };

    case 'UPDATE_SHAPE':
      return {
        ...state,
        shapes: state.shapes.map(shape =>
          shape.id === action.payload.id
            ? { ...shape, ...action.payload.updates }
            : shape
        ),
      };

    case 'DELETE_SHAPE':
      return {
        ...state,
        shapes: state.shapes.filter(shape => shape.id !== action.payload),
        selectedShapeId: state.selectedShapeId === action.payload ? null : state.selectedShapeId,
      };

    case 'SELECT_SHAPE':
      return {
        ...state,
        selectedShapeId: action.payload,
      };

    case 'DESELECT_SHAPE':
      return {
        ...state,
        selectedShapeId: null,
      };

    case 'UPDATE_CANVAS':
      return {
        ...state,
        scale: action.payload.scale ?? state.scale,
        position: action.payload.position ?? state.position,
      };

    case 'CLEAR_ALL':
      return initialState;

    default:
      return state;
  }
}

export function DiagramProvider({ children }) {
  const [state, dispatch] = useReducer(diagramReducer, initialState);

  return (
    <DiagramContext.Provider value={{ state, dispatch }}>
      {children}
    </DiagramContext.Provider>
  );
}

export function useDiagram() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagram must be used within DiagramProvider');
  }
  return context;
}
