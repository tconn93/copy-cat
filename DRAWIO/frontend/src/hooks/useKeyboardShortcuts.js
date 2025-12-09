import { useEffect } from 'react';
import { useDiagram } from '../store/DiagramContext';

let shapeCounter = 0;

export function useKeyboardShortcuts() {
  const { state, dispatch } = useDiagram();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if user is typing in an input field
      const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

      // Delete or Backspace - delete selected shape
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedShapeId && !isTyping) {
        e.preventDefault();
        dispatch({ type: 'DELETE_SHAPE', payload: state.selectedShapeId });
      }

      // Escape - deselect shape
      if (e.key === 'Escape') {
        dispatch({ type: 'DESELECT_SHAPE' });
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && !isTyping) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        if (!isTyping) {
          e.preventDefault();
          dispatch({ type: 'REDO' });
        }
      }

      // Ctrl/Cmd + C - Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && state.selectedShapeId && !isTyping) {
        e.preventDefault();
        const selectedShape = state.shapes.find(s => s.id === state.selectedShapeId);
        if (selectedShape) {
          dispatch({ type: 'COPY_SHAPE', payload: selectedShape });
        }
      }

      // Ctrl/Cmd + V - Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && state.clipboard && !isTyping) {
        e.preventDefault();
        shapeCounter++;
        const newShape = {
          ...state.clipboard,
          id: `shape-${Date.now()}-${shapeCounter}-${Math.random().toString(36).substr(2, 9)}`,
          x: state.clipboard.x + 20,
          y: state.clipboard.y + 20,
        };
        dispatch({ type: 'PASTE_SHAPE', payload: newShape });
      }

      // Ctrl/Cmd + D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && state.selectedShapeId && !isTyping) {
        e.preventDefault();
        const selectedShape = state.shapes.find(s => s.id === state.selectedShapeId);
        if (selectedShape) {
          shapeCounter++;
          const newShape = {
            ...selectedShape,
            id: `shape-${Date.now()}-${shapeCounter}-${Math.random().toString(36).substr(2, 9)}`,
            x: selectedShape.x + 20,
            y: selectedShape.y + 20,
          };
          dispatch({ type: 'PASTE_SHAPE', payload: newShape });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedShapeId, state.shapes, state.clipboard, dispatch]);
}
