import { useEffect } from 'react';
import { useDiagram } from '../store/DiagramContext';

export function useKeyboardShortcuts() {
  const { state, dispatch } = useDiagram();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete or Backspace - delete selected shape
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedShapeId) {
        // Don't delete if user is typing in an input field
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          dispatch({ type: 'DELETE_SHAPE', payload: state.selectedShapeId });
        }
      }

      // Escape - deselect shape
      if (e.key === 'Escape') {
        dispatch({ type: 'DESELECT_SHAPE' });
      }

      // Ctrl/Cmd + A - select all (future feature)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        // TODO: Implement select all
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedShapeId, dispatch]);
}
