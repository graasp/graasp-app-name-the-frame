/* eslint-disable arrow-body-style */

/* eslint-disable prettier/prettier */
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import { TipGroup } from '@/@types';
import { buildLabelActionsID } from '@/config/selectors';

const Label = styled('div')<{ isDragging: boolean }>(({
  theme,
  isDragging,
}) => {
  return {
    background: isDragging ? 'red' : theme.palette.primary.main,
    padding: theme.spacing(1),
    color: 'white',
    minWidth: '8ch',
    minHeight: '32px',
    borderRadius: theme.spacing(1),
    userSelect: 'none',
    // ...(isDragging && {
    //   position: 'relative',
    //   top: 0,
    //   left: 0,
    // }),
  };
});

const GroupContainer = styled('div')<{
  isDraggingOver: boolean;
  top: string;
  left: string;
  isAllGroup: boolean;
}>(({ theme, isDraggingOver, top, left, isAllGroup }) => ({
  minWidth: '8ch',
  minHeight: '32px',
  borderRadius: theme.spacing(1),
  background: isAllGroup ? 'white' : 'white',
  position: isAllGroup ? 'relative' : 'absolute',
  ...(!isAllGroup && { top, left }),
  display: 'flex',
  gap: theme.spacing(1),
  border: isAllGroup ? 'none' : '1px solid black',
}));

type Props = {
  el: TipGroup;
  deleteLabel?: (labelId: string) => void;
  editLabel?: (labelId: string) => void;
  // imageSize: { clientHeight: number; clientWidth: number };
};
const LabelPin = ({ el, deleteLabel, editLabel }: Props): JSX.Element => {
  const { permission } = useLocalContext();

  return (
    <Droppable droppableId={`${el.ind}`}>
      {(provided, snapshot) => (
        <GroupContainer
          ref={provided.innerRef}
          {...provided.droppableProps}
          top={el.top}
          left={el.left}
          isDraggingOver={snapshot.isDraggingOver}
          isAllGroup={el.ind === 0}
        >
          {el.choices?.map((item, index) => (
            <Draggable key={item?.id} draggableId={item?.id} index={index}>
              {(dragProvided, dragSnapshot) => (
                <Label
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                  isDragging={dragSnapshot.isDragging}
                  // left={
                  //   (dragProvided.draggableProps.style as DraggingStyle).left -
                  //   parseFloat(el.left.replace('%', ''))
                  // }
                  // top={el.top}
                >
                  <Box
                    display="flex"
                    sx={{
                      position: 'relative',
                      '&:hover': {
                        [`#${buildLabelActionsID(item.id)}`]: {
                          display: 'inline-block',
                        },
                      },
                    }}
                  >
                    {item.content}
                    {permission === 'admin' && (
                      <Box
                        display="flex"
                        sx={{
                          position: 'absolute',
                          top: -15,
                          right: -10,
                          display: 'none',
                        }}
                        id={buildLabelActionsID(item.id)}
                      >
                        {editLabel && (
                          <IconButton
                            sx={{
                              padding: '4px',
                              background: '#00000085',
                              borderRadius: '50%',
                            }}
                            onClick={() => editLabel(item.id)}
                          >
                            <Edit sx={{ color: 'white' }} fontSize="small" />
                          </IconButton>
                        )}
                        {deleteLabel && (
                          <IconButton
                            sx={{
                              padding: '4px',
                              background: '#00000085',
                              borderRadius: '50%',
                            }}
                            onClick={() => deleteLabel(item.id)}
                          >
                            <DeleteIcon
                              sx={{ color: 'white' }}
                              fontSize="small"
                            />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Box>
                </Label>
              )}
            </Draggable>
          ))}
        </GroupContainer>
      )}
    </Droppable>
  );
};

export default LabelPin;
