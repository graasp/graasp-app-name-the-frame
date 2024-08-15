import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { styled } from '@mui/material';

import { Label } from '@/@types';
import { ALL_DROPPABLE_CONTAINER_ID } from '@/config/selectors';

import DraggableLabel from './DraggableLabelToDroppableCont';

export const Container = styled('div')<{
  isDraggingOver: boolean;
}>(({ theme, isDraggingOver }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  borderRadius: theme.spacing(1),
  background: isDraggingOver ? 'lightgray' : 'white',
  width: '100%',
  minHeight: '40px',
  padding: '2px',
  border: '1px solid black',
}));

type Props = {
  labels: Label[];
};

const AllLabelsContainer = ({ labels }: Props): JSX.Element => (
  <Droppable droppableId={ALL_DROPPABLE_CONTAINER_ID}>
    {(provided, dropSnapshot) => (
      <Container
        ref={provided.innerRef}
        {...provided.droppableProps}
        isDraggingOver={dropSnapshot.isDraggingOver}
      >
        {labels.map((item, index) => (
          <DraggableLabel
            content={item.content}
            draggableId={item?.id}
            index={index}
            key={item?.id}
          />
        ))}
        {provided.placeholder}
      </Container>
    )}
  </Droppable>
);

export default AllLabelsContainer;
