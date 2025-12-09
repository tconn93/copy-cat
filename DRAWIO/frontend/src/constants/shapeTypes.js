export const SHAPE_TYPES = {
  // Basic Shapes
  RECTANGLE: 'rectangle',
  ROUNDED_RECT: 'rounded_rectangle',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  TRIANGLE: 'triangle',
  PENTAGON: 'pentagon',
  HEXAGON: 'hexagon',
  STAR: 'star',

  // Flowchart Shapes
  PROCESS: 'process',
  DECISION: 'decision',
  DATA: 'data',
  TERMINAL: 'terminal',
  PREPARATION: 'preparation',
  DOCUMENT: 'document',
  STORED_DATA: 'stored_data',

  // Arrows and Connectors
  ARROW: 'arrow',
  LINE: 'line',
  CONNECTOR: 'connector',

  // UML Shapes
  CLASS: 'uml_class',
  ACTOR: 'uml_actor',
  NOTE: 'uml_note',
};

export const DEFAULT_SHAPE_PROPS = {
  // Basic Shapes
  [SHAPE_TYPES.RECTANGLE]: {
    width: 120,
    height: 60,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    cornerRadius: 0,
  },
  [SHAPE_TYPES.ROUNDED_RECT]: {
    width: 120,
    height: 60,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    cornerRadius: 10,
  },
  [SHAPE_TYPES.CIRCLE]: {
    radius: 40,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.ELLIPSE]: {
    radiusX: 60,
    radiusY: 40,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.TRIANGLE]: {
    width: 100,
    height: 87,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.PENTAGON]: {
    radius: 50,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.HEXAGON]: {
    radius: 50,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.STAR]: {
    radius: 50,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },

  // Flowchart Shapes
  [SHAPE_TYPES.PROCESS]: {
    width: 120,
    height: 60,
    fill: '#dae8fc',
    stroke: '#6c8ebf',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.DECISION]: {
    width: 100,
    height: 100,
    fill: '#fff2cc',
    stroke: '#d6b656',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.DATA]: {
    width: 120,
    height: 60,
    fill: '#d5e8d4',
    stroke: '#82b366',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.TERMINAL]: {
    width: 120,
    height: 60,
    fill: '#f8cecc',
    stroke: '#b85450',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.PREPARATION]: {
    width: 120,
    height: 60,
    fill: '#e1d5e7',
    stroke: '#9673a6',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.DOCUMENT]: {
    width: 120,
    height: 80,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.STORED_DATA]: {
    width: 120,
    height: 60,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },

  // Arrows and Connectors
  [SHAPE_TYPES.ARROW]: {
    points: [0, 0, 100, 0],
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 2,
    pointerLength: 10,
    pointerWidth: 10,
  },
  [SHAPE_TYPES.LINE]: {
    points: [0, 0, 100, 0],
    stroke: '#000000',
    strokeWidth: 2,
    startShapeId: null,
    endShapeId: null,
    startAnchor: null,
    endAnchor: null,
  },
  [SHAPE_TYPES.CONNECTOR]: {
    points: [0, 0, 100, 0],
    stroke: '#000000',
    strokeWidth: 2,
    startShapeId: null,
    endShapeId: null,
    startAnchor: null,
    endAnchor: null,
  },

  // UML Shapes
  [SHAPE_TYPES.CLASS]: {
    width: 140,
    height: 120,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.ACTOR]: {
    width: 60,
    height: 100,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.NOTE]: {
    width: 100,
    height: 80,
    fill: '#ffffcc',
    stroke: '#cccc00',
    strokeWidth: 1,
  },
};

export const SHAPE_CATEGORIES = {
  BASIC: 'Basic Shapes',
  FLOWCHART: 'Flowchart',
  CONNECTORS: 'Connectors',
  UML: 'UML',
};

export const CATEGORIZED_SHAPES = {
  [SHAPE_CATEGORIES.BASIC]: [
    { type: SHAPE_TYPES.RECTANGLE, name: 'Rectangle', icon: '▭' },
    { type: SHAPE_TYPES.ROUNDED_RECT, name: 'Rounded Rectangle', icon: '▢' },
    { type: SHAPE_TYPES.CIRCLE, name: 'Circle', icon: '○' },
    { type: SHAPE_TYPES.ELLIPSE, name: 'Ellipse', icon: '⬭' },
    { type: SHAPE_TYPES.TRIANGLE, name: 'Triangle', icon: '△' },
    { type: SHAPE_TYPES.PENTAGON, name: 'Pentagon', icon: '⬠' },
    { type: SHAPE_TYPES.HEXAGON, name: 'Hexagon', icon: '⬡' },
    { type: SHAPE_TYPES.STAR, name: 'Star', icon: '★' },
  ],
  [SHAPE_CATEGORIES.FLOWCHART]: [
    { type: SHAPE_TYPES.PROCESS, name: 'Process', icon: '▭' },
    { type: SHAPE_TYPES.DECISION, name: 'Decision', icon: '◇' },
    { type: SHAPE_TYPES.DATA, name: 'Data', icon: '▱' },
    { type: SHAPE_TYPES.TERMINAL, name: 'Terminal', icon: '▢' },
    { type: SHAPE_TYPES.PREPARATION, name: 'Preparation', icon: '⬡' },
    { type: SHAPE_TYPES.DOCUMENT, name: 'Document', icon: '📄' },
    { type: SHAPE_TYPES.STORED_DATA, name: 'Stored Data', icon: '🗄️' },
  ],
  [SHAPE_CATEGORIES.CONNECTORS]: [
    { type: SHAPE_TYPES.LINE, name: 'Line', icon: '─' },
    { type: SHAPE_TYPES.ARROW, name: 'Arrow', icon: '→' },
    { type: SHAPE_TYPES.CONNECTOR, name: 'Smart Connector', icon: '⇢' },
  ],
  [SHAPE_CATEGORIES.UML]: [
    { type: SHAPE_TYPES.CLASS, name: 'Class', icon: '▭' },
    { type: SHAPE_TYPES.ACTOR, name: 'Actor', icon: '🧑' },
    { type: SHAPE_TYPES.NOTE, name: 'Note', icon: '📝' },
  ],
};

export const CANVAS_CONFIG = {
  width: window.innerWidth,
  height: window.innerHeight,
  gridSize: 10,
  gridEnabled: true,
};

// Connection anchor points for shapes (relative to shape bounds)
export const CONNECTION_ANCHORS = {
  TOP: { x: 0.5, y: 0 },
  RIGHT: { x: 1, y: 0.5 },
  BOTTOM: { x: 0.5, y: 1 },
  LEFT: { x: 0, y: 0.5 },
  TOP_LEFT: { x: 0, y: 0 },
  TOP_RIGHT: { x: 1, y: 0 },
  BOTTOM_LEFT: { x: 0, y: 1 },
  BOTTOM_RIGHT: { x: 1, y: 1 },
};
