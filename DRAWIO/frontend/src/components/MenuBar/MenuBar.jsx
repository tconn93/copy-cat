import { useState, useRef } from 'react';
import { useDiagram } from '../../store/DiagramContext';
import {
  saveDiagramAsXML,
  loadDiagramFromXML,
  exportToPNG,
  exportToSVG,
} from '../../utils/exportUtils';
import './MenuBar.css';

export function MenuBar({ stageRef }) {
  const { state, dispatch } = useDiagram();
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleNew = () => {
    if (window.confirm('Create a new diagram? This will clear all shapes.')) {
      dispatch({ type: 'CLEAR_ALL' });
    }
    setIsFileMenuOpen(false);
  };

  const handleSave = () => {
    const filename = prompt('Enter filename:', 'diagram.drawio');
    if (filename) {
      saveDiagramAsXML(state.shapes, filename);
    }
    setIsFileMenuOpen(false);
  };

  const handleOpen = () => {
    fileInputRef.current?.click();
    setIsFileMenuOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const shapes = await loadDiagramFromXML(file);
        dispatch({ type: 'CLEAR_ALL' });
        shapes.forEach(shape => {
          dispatch({ type: 'ADD_SHAPE', payload: shape });
        });
      } catch (error) {
        alert('Failed to load diagram: ' + error.message);
      }
    }
    // Reset input
    e.target.value = '';
  };

  const handleExportPNG = () => {
    const filename = prompt('Enter filename:', 'diagram.png');
    if (filename) {
      exportToPNG(stageRef, filename);
    }
    setIsFileMenuOpen(false);
  };

  const handleExportSVG = () => {
    const filename = prompt('Enter filename:', 'diagram.svg');
    if (filename) {
      exportToSVG(state.shapes, filename);
    }
    setIsFileMenuOpen(false);
  };

  return (
    <div className="menubar">
      <div className="menu-item">
        <button
          className="menu-button"
          onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
        >
          File ▾
        </button>
        {isFileMenuOpen && (
          <>
            <div className="menu-overlay" onClick={() => setIsFileMenuOpen(false)} />
            <div className="menu-dropdown">
              <button className="menu-option" onClick={handleNew}>
                📄 New
              </button>
              <button className="menu-option" onClick={handleOpen}>
                📂 Open...
              </button>
              <button className="menu-option" onClick={handleSave}>
                💾 Save as XML...
              </button>
              <div className="menu-divider" />
              <button className="menu-option" onClick={handleExportPNG}>
                🖼️ Export as PNG...
              </button>
              <button className="menu-option" onClick={handleExportSVG}>
                📐 Export as SVG...
              </button>
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".drawio,.xml"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
