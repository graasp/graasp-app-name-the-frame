import { Droppable } from 'react-beautiful-dnd';
import { useControls } from 'react-zoom-pan-pinch';

import { styled } from '@mui/material';

import { AnsweredLabel } from '@/@types';
import { buildDraggableLabelId } from '@/config/selectors';

import DraggableLabelToDroppableCont, {
  DraggableLabelToDroppableContProps,
} from './DraggableLabelToDroppableCont';

export const Wrapper = styled('div')<{
  top: string;
  left: string;
  isFilled: boolean;
  isDraggingOver: boolean;
  isDragging?: boolean;
}>(({ theme, top, left, isFilled, isDraggingOver, isDragging }) => ({
  borderRadius: theme.spacing(1),
  background: isDraggingOver ? 'lightgray' : 'white',
  position: 'absolute',
  top,
  left,
  ...(!isFilled && {
    minHeight: '4ch',
    minWidth: '8ch',
    border: isDraggingOver ? 'none' : '1px solid black',
    ...(isDragging && {
      border: `2px solid ${theme.palette.primary.main}`,
      transform: 'scale(1.1)',
    }),
  }),
  // scale label to 0.5 for small devices
  [theme.breakpoints.down('sm')]: {
    transform: 'scale(0.5)',
    transformOrigin: 'top left',
  },
}));

type Props = {
  label: AnsweredLabel;
  isDragging?: boolean;
  isSubmitted: boolean;
  index: number;
  onRemoveLabel: DraggableLabelToDroppableContProps['onRemoveLabel'];
};

const DroppableLabel = ({
  label,
  isDragging,
  isSubmitted,
  index,
  onRemoveLabel,
}: Props): JSX.Element => {
  // instance exists if within transform wrapper: inside frame
  const { instance } = useControls();

  return (
    <Droppable droppableId={label.expected.id} key={label.expected.id}>
      {(provided, dropSnapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.droppableProps}
          top={label.expected.y}
          left={label.expected.x}
          isFilled={Boolean(label.actual)}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDragging={isDragging}
          id={buildDraggableLabelId(label.expected.id)}
        >
          {label.actual ? (
            <DraggableLabelToDroppableCont
              isCorrect={label.expected.id === label.actual?.id}
              isSubmitted={isSubmitted}
              content={label.actual.content}
              index={index}
              label={label.actual}
              isDragDisabled={Boolean(instance)}
              onRemoveLabel={onRemoveLabel}
            />
          ) : null}
          {provided.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
};

export default DroppableLabel;
