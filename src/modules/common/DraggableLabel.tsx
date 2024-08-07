import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { styled } from '@mui/material';

export const StyledLabel = styled('div')<{
  isDraggable: boolean;
}>(({ theme, isDraggable }) => ({
  color: 'white',
  borderRadius: theme.spacing(1),
  gap: theme.spacing(1),
  userSelect: 'none',
  border: '1px solid white',
  padding: theme.spacing(0.5),
  ...(isDraggable
    ? {
        left: 'initial !important',
        top: 'initial !important',
        background: 'purple',
      }
    : {
        background: theme.palette.primary.main,
      }),
}));

type Props = {
  index: number;
  draggableId: string;
  content: string;
};
const DraggableLabel = ({
  draggableId,
  index,
  content,
}: Props): JSX.Element => (
  <Draggable draggableId={draggableId} index={index}>
    {(dragProvided, dragSnapshot) => (
      <StyledLabel
        ref={dragProvided.innerRef}
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}
        isDraggable={dragSnapshot.isDragging}
      >
        {content}
      </StyledLabel>
    )}
  </Draggable>
);

export default DraggableLabel;
