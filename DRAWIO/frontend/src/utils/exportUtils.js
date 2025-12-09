import { saveAs } from 'file-saver';
import { shapesToXML, xmlToShapes } from './xmlParser';

// Save diagram as XML file
export function saveDiagramAsXML(shapes, filename = 'diagram.drawio') {
  const xmlString = shapesToXML(shapes);
  const blob = new Blob([xmlString], { type: 'application/xml;charset=utf-8' });
  saveAs(blob, filename);
}

// Load diagram from XML file
export function loadDiagramFromXML(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const xmlString = e.target.result;
        const shapes = xmlToShapes(xmlString);
        resolve(shapes);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

// Export canvas to PNG
export function exportToPNG(stageRef, filename = 'diagram.png') {
  if (!stageRef || !stageRef.current) {
    console.error('Stage reference not available');
    return;
  }

  const stage = stageRef.current;
  const uri = stage.toDataURL({ pixelRatio: 2 });

  // Create download link
  const link = document.createElement('a');
  link.download = filename;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export canvas to SVG (simplified version)
export function exportToSVG(shapes, filename = 'diagram.svg') {
  // Create SVG header
  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" viewBox="0 0 2000 2000">
  <rect width="100%" height="100%" fill="white"/>
`;

  // Add shapes to SVG
  shapes.forEach(shape => {
    const { x, y, fill, stroke, strokeWidth, text } = shape;

    switch (shape.type) {
      case 'rectangle':
        svgContent += `  <rect x="${x}" y="${y}" width="${shape.width}" height="${shape.height}"
          fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
        break;

      case 'circle':
        svgContent += `  <circle cx="${x}" cy="${y}" r="${shape.radius}"
          fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
        break;

      case 'diamond':
        const cx = x + shape.width / 2;
        const cy = y + shape.height / 2;
        const points = `${cx},${y} ${x + shape.width},${cy} ${cx},${y + shape.height} ${x},${cy}`;
        svgContent += `  <polygon points="${points}"
          fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
        break;

      case 'line':
        const x2 = x + shape.points[2];
        const y2 = y + shape.points[3];
        svgContent += `  <line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}"
          stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
        break;

      case 'arrow':
        const ax2 = x + shape.points[2];
        const ay2 = y + shape.points[3];
        svgContent += `  <line x1="${x}" y1="${y}" x2="${ax2}" y2="${ay2}"
          stroke="${stroke}" stroke-width="${strokeWidth}" marker-end="url(#arrowhead)"/>\n`;
        break;
    }

    // Add text if present
    if (text) {
      svgContent += `  <text x="${x + (shape.width || 0) / 2}" y="${y + (shape.height || 0) / 2}"
        font-family="Arial" font-size="14" fill="black" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>\n`;
    }
  });

  // Add arrow marker definition
  svgContent += `  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="black" />
    </marker>
  </defs>
`;

  svgContent += '</svg>';

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  saveAs(blob, filename);
}

// Save to localStorage
export function saveToLocalStorage(shapes) {
  try {
    const data = JSON.stringify({
      shapes,
      timestamp: Date.now(),
    });
    localStorage.setItem('drawio-clone-autosave', data);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

// Load from localStorage
export function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem('drawio-clone-autosave');
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.shapes || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
}

// Clear localStorage
export function clearLocalStorage() {
  try {
    localStorage.removeItem('drawio-clone-autosave');
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
}
