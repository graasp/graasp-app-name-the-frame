import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Box, styled } from '@mui/material';

import { DraggableLabel } from '@/@types';

export const Label = styled('div')<{ isDraggable: boolean }>(
  ({ theme, isDraggable }) => ({
    background: 'red',
    color: 'white',
    borderRadius: theme.spacing(1),
    userSelect: 'none',
    padding: theme.spacing(0.5),
    ...(isDraggable && {
      left: 'auto !important',
      top: 'auto !important',
    }),
  }),
);

export const GroupContainer = styled(Box)<{
  top: string;
  left: string;
}>(({ theme, top, left }) => ({
  borderRadius: theme.spacing(1),
  background: 'white',
  position: 'absolute',
  top,
  left,
  display: 'flex',
  gap: theme.spacing(1),
  border: '1px solid white',
  borderColor: 'black',
  minHeight: '4ch',
  minWidth: '8ch',
}));

type Props = {
  label: DraggableLabel;
  draggingOverItem?: boolean;
};

const LabelPin = ({ label }: Props): JSX.Element => (
  <Droppable
    droppableId={`${label.ind}`}
    //   isDropDisabled={!draggingOverItem}
  >
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        style={{ background: 'green', display: 'flex' }}
      >
        {label.choices?.map((item, index) => (
          <Draggable
            key={item?.id}
            draggableId={item?.id}
            index={index}
            // isDragDisabled={!draggingOverItem}
          >
            {(dragProvided, dragSnapshot) => (
              <Label
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
              </Label>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default LabelPin;
