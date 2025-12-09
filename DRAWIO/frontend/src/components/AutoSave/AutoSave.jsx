import { useEffect, useRef } from 'react';
import { useDiagram } from '../../store/DiagramContext';
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/exportUtils';

export function AutoSave() {
  const { state, dispatch } = useDiagram();
  const hasLoadedRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    // Prevent loading twice (React StrictMode runs effects twice in dev)
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const shapes = loadFromLocalStorage();
    if (shapes.length > 0) {
      const shouldLoad = window.confirm(
        `Found auto-saved diagram with ${shapes.length} shape(s). Load it?`
      );
      if (shouldLoad) {
        shapes.forEach(shape => {
          dispatch({ type: 'ADD_SHAPE', payload: shape });
        });
      }
    }
  }, [dispatch]);

  // Auto-save to localStorage whenever shapes change
  useEffect(() => {
    if (state.shapes.length > 0) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(state.shapes);
      }, 1000); // Debounce by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [state.shapes]);

  return null; // This component doesn't render anything
}
