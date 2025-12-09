import { Layer, Line, Rect } from 'react-konva';
import { useDiagram } from '../../store/DiagramContext';
import { RULER_SIZE } from './Rulers';

export function Guides() {
  const { state, dispatch } = useDiagram();

  const handleGuideDragMove = (guideId, e) => {
    const guide = state.guides.find(g => g.id === guideId);
    if (!guide) return;

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();

    // Calculate position based on guide type
    let newPosition;
    if (guide.type === 'horizontal') {
      newPosition = (pointerPos.y - state.position.y) / state.scale;
    } else {
      newPosition = (pointerPos.x - state.position.x) / state.scale;
    }

    dispatch({
      type: 'UPDATE_GUIDE',
      payload: { id: guideId, position: newPosition },
    });
  };

  const handleGuideDragEnd = (guideId, e) => {
    const guide = state.guides.find(g => g.id === guideId);
    if (!guide) return;

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();

    // Delete guide if dragged back to ruler area
    if (guide.type === 'horizontal' && pointerPos.y < RULER_SIZE) {
      dispatch({ type: 'DELETE_GUIDE', payload: guideId });
    } else if (guide.type === 'vertical' && pointerPos.x < RULER_SIZE) {
      dispatch({ type: 'DELETE_GUIDE', payload: guideId });
    }
  };

  return (
    <Layer listening={true}>
      {state.guides.map((guide) => {
        const screenPosition =
          guide.type === 'horizontal'
            ? guide.position * state.scale + state.position.y
            : guide.position * state.scale + state.position.x;

        const isHorizontal = guide.type === 'horizontal';

        return (
          <Line
            key={guide.id}
            points={
              isHorizontal
                ? [0, screenPosition, window.innerWidth, screenPosition]
                : [screenPosition, 0, screenPosition, window.innerHeight]
            }
            stroke="#FF4081"
            strokeWidth={1}
            dash={[5, 5]}
            draggable
            dragBoundFunc={(pos) => {
              // Constrain dragging to the appropriate axis
              return isHorizontal
                ? { x: 0, y: pos.y }
                : { x: pos.x, y: 0 };
            }}
            onDragMove={(e) => handleGuideDragMove(guide.id, e)}
            onDragEnd={(e) => handleGuideDragEnd(guide.id, e)}
          />
        );
      })}
    </Layer>
  );
}
