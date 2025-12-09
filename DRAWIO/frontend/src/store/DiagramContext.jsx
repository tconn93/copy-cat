import { createContext, useContext, useReducer } from 'react';

const DiagramContext = createContext();

const initialState = {
  shapes: [],
  selectedShapeId: null,
  scale: 1,
  position: { x: 0, y: 0 },
  history: [],
  historyIndex: -1,
  clipboard: null,
  guides: [], // { id, type: 'horizontal' | 'vertical', position: number }
};

// Actions that should be recorded in history
const HISTORY_ACTIONS = ['ADD_SHAPE', 'UPDATE_SHAPE', 'DELETE_SHAPE', 'CLEAR_ALL', 'PASTE_SHAPE'];

function createHistoryEntry(state) {
  return {
    shapes: state.shapes,
    selectedShapeId: state.selectedShapeId,
  };
}

function diagramReducer(state, action) {
  let newState = state;

  switch (action.type) {
    case 'ADD_SHAPE':
      newState = {
        ...state,
        shapes: [...state.shapes, action.payload],
      };
      break;

    case 'UPDATE_SHAPE':
      newState = {
        ...state,
        shapes: state.shapes.map(shape =>
          shape.id === action.payload.id
            ? { ...shape, ...action.payload.updates }
            : shape
        ),
      };
      break;

    case 'DELETE_SHAPE':
      newState = {
        ...state,
        shapes: state.shapes.filter(shape => shape.id !== action.payload),
        selectedShapeId: state.selectedShapeId === action.payload ? null : state.selectedShapeId,
      };
      break;

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
      newState = {
        ...state,
        shapes: [],
        selectedShapeId: null,
      };
      break;

    case 'COPY_SHAPE':
      return {
        ...state,
        clipboard: action.payload,
      };

    case 'PASTE_SHAPE':
      newState = {
        ...state,
        shapes: [...state.shapes, action.payload],
        selectedShapeId: action.payload.id,
      };
      break;

    case 'UNDO':
      if (state.historyIndex > 0) {
        const previousEntry = state.history[state.historyIndex - 1];
        return {
          ...state,
          shapes: previousEntry.shapes,
          selectedShapeId: previousEntry.selectedShapeId,
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const nextEntry = state.history[state.historyIndex + 1];
        return {
          ...state,
          shapes: nextEntry.shapes,
          selectedShapeId: nextEntry.selectedShapeId,
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    case 'ADD_GUIDE':
      return {
        ...state,
        guides: [...state.guides, action.payload],
      };

    case 'UPDATE_GUIDE':
      return {
        ...state,
        guides: state.guides.map(guide =>
          guide.id === action.payload.id
            ? { ...guide, position: action.payload.position }
            : guide
        ),
      };

    case 'DELETE_GUIDE':
      return {
        ...state,
        guides: state.guides.filter(guide => guide.id !== action.payload),
      };

    default:
      return state;
  }

  // Add to history if this is a history-tracked action
  if (HISTORY_ACTIONS.includes(action.type)) {
    const historyEntry = createHistoryEntry(newState);

    // Remove any future history (after current index)
    const newHistory = state.history.slice(0, state.historyIndex + 1);

    // Add new entry
    newHistory.push(historyEntry);

    // Limit history to 50 entries
    const limitedHistory = newHistory.slice(-50);

    return {
      ...newState,
      history: limitedHistory,
      historyIndex: limitedHistory.length - 1,
    };
  }

  return newState;
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
