import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Box, styled } from '@mui/material';

import { DraggableLabelType } from '@/@types';

export const Container = styled('div')<{
  isAllGroup: boolean;
  top: string;
  left: string;
  isFilled: boolean;
  isDraggingOver: boolean;
}>(({ theme, isAllGroup, top, left, isFilled, isDraggingOver }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  borderRadius: theme.spacing(1),
  background: isDraggingOver ? 'lightgray' : 'white',
  ...(isAllGroup
    ? {
        width: '100%',
        height: '40px',
        padding: '2px',
        border: '1px solid black',
      }
    : {
        position: 'absolute',
        top,
        left,
        [theme.breakpoints.down('sm')]: {
          transform: 'scale(0.5)',
          transformOrigin: 'top left',
        },
      }),
  ...(!isFilled && {
    minHeight: '4ch',
    minWidth: '8ch',
    border: isDraggingOver ? 'none' : '1px solid black',
  }),
}));

export const StyledLabel = styled('div')<{
  isDraggable: boolean;
}>(({ theme, isDraggable }) => ({
  background: theme.palette.primary.main,
  color: 'white',
  borderRadius: theme.spacing(1),
  gap: theme.spacing(1),
  userSelect: 'none',
  border: '1px solid white',
  padding: theme.spacing(0.5),
  ...(isDraggable && {
    left: 'initial !important',
    top: 'initial !important',
    background: 'purple',
  }),
}));

type Props = {
  label: DraggableLabelType;
  draggingOverItem?: boolean;
};

const DroppableDraggableLabel = ({ label }: Props): JSX.Element => (
  <Droppable droppableId={`${label.ind}`}>
    {(provided, dropSnapshot) => (
      <Container
        ref={provided.innerRef}
        {...provided.droppableProps}
        isAllGroup={label.ind === 0}
        top={label.y}
        left={label.x}
        isFilled={label.choices.length > 0}
        isDraggingOver={dropSnapshot.isDraggingOver}
      >
        {label.choices?.map((item, index) => (
          <div key={item?.id}>
            <Draggable draggableId={item?.id} index={index}>
              {(dragProvided, dragSnapshot) => (
                <StyledLabel
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                  isDraggable={dragSnapshot.isDragging}
                >
                  <Box
                    display="flex"
                    sx={{
                      position: 'relative',
                    }}
                  >
                    {item.content}
                  </Box>
                </StyledLabel>
              )}
            </Draggable>
          </div>
        ))}
        {provided.placeholder}
      </Container>
    )}
  </Droppable>
);

export default DroppableDraggableLabel;
