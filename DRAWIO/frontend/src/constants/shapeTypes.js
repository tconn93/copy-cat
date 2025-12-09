export const SHAPE_TYPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  DIAMOND: 'diamond',
  ARROW: 'arrow',
  LINE: 'line',
};

export const DEFAULT_SHAPE_PROPS = {
  [SHAPE_TYPES.RECTANGLE]: {
    width: 120,
    height: 60,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.CIRCLE]: {
    radius: 40,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
  [SHAPE_TYPES.DIAMOND]: {
    width: 100,
    height: 100,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  },
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
  },
};

export const CANVAS_CONFIG = {
  width: window.innerWidth,
  height: window.innerHeight,
  gridSize: 10,
  gridEnabled: true,
};
