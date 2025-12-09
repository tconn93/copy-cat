import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { SHAPE_TYPES } from '../constants/shapeTypes';

// Convert our shapes to draw.io XML format
export function shapesToXML(shapes) {
  const cells = shapes.map((shape, index) => {
    const cell = {
      '@_id': shape.id,
      '@_value': shape.text || '',
      '@_vertex': '1',
      '@_parent': '1',
    };

    // Add geometry
    const geometry = {
      '@_x': shape.x || 0,
      '@_y': shape.y || 0,
      '@_width': shape.width || shape.radius * 2 || 100,
      '@_height': shape.height || shape.radius * 2 || 100,
      '@_as': 'geometry',
    };

    // Build style string
    const styleProps = [];
    if (shape.fill) styleProps.push(`fillColor=${shape.fill}`);
    if (shape.stroke) styleProps.push(`strokeColor=${shape.stroke}`);
    if (shape.strokeWidth) styleProps.push(`strokeWidth=${shape.strokeWidth}`);

    // Add shape-specific styles
    switch (shape.type) {
      case SHAPE_TYPES.RECTANGLE:
        styleProps.push('rounded=0');
        break;
      case SHAPE_TYPES.CIRCLE:
        styleProps.push('ellipse');
        break;
      case SHAPE_TYPES.DIAMOND:
        styleProps.push('rhombus');
        break;
      case SHAPE_TYPES.ARROW:
        styleProps.push('arrow');
        break;
      case SHAPE_TYPES.LINE:
        styleProps.push('line');
        break;
    }

    cell['@_style'] = styleProps.join(';');
    cell.mxGeometry = geometry;

    return cell;
  });

  // Build the complete XML structure
  const xmlObj = {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'UTF-8',
    },
    mxfile: {
      '@_host': 'drawio-clone',
      '@_modified': new Date().toISOString(),
      '@_version': '1.0.0',
      diagram: {
        '@_id': 'diagram-1',
        '@_name': 'Page-1',
        mxGraphModel: {
          '@_dx': '1422',
          '@_dy': '794',
          '@_grid': '1',
          '@_gridSize': '10',
          root: {
            mxCell: [
              { '@_id': '0' },
              { '@_id': '1', '@_parent': '0' },
              ...cells,
            ],
          },
        },
      },
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    indentBy: '  ',
  });

  return builder.build(xmlObj);
}

// Parse draw.io XML format to our shapes
export function xmlToShapes(xmlString) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: true,
  });

  try {
    const parsed = parser.parse(xmlString);
    const cells = parsed?.mxfile?.diagram?.mxGraphModel?.root?.mxCell || [];

    // Filter out root cells (id 0 and 1)
    const shapeCells = Array.isArray(cells)
      ? cells.filter(cell => cell['@_id'] !== '0' && cell['@_id'] !== '1' && cell['@_vertex'])
      : [];

    return shapeCells.map(cell => {
      const style = cell['@_style'] || '';
      const geometry = cell.mxGeometry || {};

      // Determine shape type from style
      let type = SHAPE_TYPES.RECTANGLE;
      if (style.includes('ellipse')) type = SHAPE_TYPES.CIRCLE;
      else if (style.includes('rhombus')) type = SHAPE_TYPES.DIAMOND;
      else if (style.includes('arrow')) type = SHAPE_TYPES.ARROW;
      else if (style.includes('line')) type = SHAPE_TYPES.LINE;

      // Parse style properties
      const styleObj = {};
      style.split(';').forEach(prop => {
        const [key, value] = prop.split('=');
        if (key && value) {
          styleObj[key] = value;
        }
      });

      const shape = {
        id: cell['@_id'],
        type,
        x: parseFloat(geometry['@_x']) || 0,
        y: parseFloat(geometry['@_y']) || 0,
        text: cell['@_value'] || '',
        fill: styleObj.fillColor || '#ffffff',
        stroke: styleObj.strokeColor || '#000000',
        strokeWidth: parseFloat(styleObj.strokeWidth) || 2,
      };

      // Add type-specific properties
      if (type === SHAPE_TYPES.CIRCLE) {
        shape.radius = parseFloat(geometry['@_width']) / 2 || 40;
      } else if (type === SHAPE_TYPES.RECTANGLE || type === SHAPE_TYPES.DIAMOND) {
        shape.width = parseFloat(geometry['@_width']) || 120;
        shape.height = parseFloat(geometry['@_height']) || 60;
      } else if (type === SHAPE_TYPES.ARROW || type === SHAPE_TYPES.LINE) {
        shape.points = [0, 0, 100, 0];
        if (type === SHAPE_TYPES.ARROW) {
          shape.pointerLength = 10;
          shape.pointerWidth = 10;
        }
      }

      return shape;
    });
  } catch (error) {
    console.error('Error parsing XML:', error);
    return [];
  }
}
