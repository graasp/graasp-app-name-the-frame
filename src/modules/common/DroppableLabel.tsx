import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { styled } from '@mui/material';

import { AnsweredLabel } from '@/@types';

import DraggableLabelToDroppableCont from './DraggableLabelToDroppableCont';

export const Container = styled('div')<{
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
};

const DroppableLabel = ({
  label,
  isDragging,
  isSubmitted,
}: Props): JSX.Element => (
  <Droppable droppableId={label.expected.id}>
    {(provided, dropSnapshot) => (
      <Container
        ref={provided.innerRef}
        {...provided.droppableProps}
        top={label.expected.y}
        left={label.expected.x}
        isFilled={Boolean(label.actual)}
        isDraggingOver={dropSnapshot.isDraggingOver}
        isDragging={isDragging}
      >
        {label.actual && (
          <DraggableLabelToDroppableCont
            isCorrect={label.expected.id === label.actual?.id}
            isSubmitted={isSubmitted}
            content={label.actual.content}
            index={0}
            draggableId={label.actual.id}
          />
        )}
        {provided.placeholder}
      </Container>
    )}
  </Droppable>
);

export default DroppableLabel;
