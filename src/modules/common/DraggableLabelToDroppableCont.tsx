import { Draggable } from 'react-beautiful-dnd';

import { styled } from '@mui/material';

import { buildDraggableLabelId } from '@/config/selectors';

export const StyledLabel = styled('div')<{
  isDraggable: boolean;
  isSubmitted?: boolean;
  isCorrect?: boolean;
}>(({ theme, isDraggable, isSubmitted, isCorrect }) => ({
  color: 'white',
  borderRadius: theme.spacing(1),
  border: '1px solid white',
  padding: theme.spacing(1),
  ...(isDraggable
    ? {
        background: 'purple',
      }
    : {
        background: theme.palette.primary.main,
      }),
  ...(isSubmitted && {
    background: isCorrect
      ? theme.palette.success.main
      : theme.palette.error.main,
  }),
}));

type Props = {
  index: number;
  draggableId: string;
  content: string;
  isSubmitted?: boolean;
  isCorrect?: boolean;
};
const DraggableLabelToDroppableCont = ({
  draggableId,
  index,
  content,
  isSubmitted = false,
  isCorrect,
}: Props): JSX.Element => (
  <Draggable
    key={draggableId}
    draggableId={draggableId}
    index={index}
    isDragDisabled={isSubmitted}
  >
    {(dragProvided, dragSnapshot) => (
      <StyledLabel
        ref={dragProvided.innerRef}
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}
        isDraggable={dragSnapshot.isDragging}
        isSubmitted={isSubmitted}
        isCorrect={isCorrect}
        id={buildDraggableLabelId(draggableId)}
      >
        {content}
      </StyledLabel>
    )}
  </Draggable>
);

export default DraggableLabelToDroppableCont;
