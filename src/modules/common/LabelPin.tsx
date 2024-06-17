import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { DraggableLabel } from '@/@types';
import { buildLabelActionsID } from '@/config/selectors';

const Label = styled('div')(({ theme }) => ({
  background: theme.palette.primary.main,
  color: 'white',
  borderRadius: theme.spacing(1),
  userSelect: 'none',
  padding: theme.spacing(0.5),
}));

const GroupContainer = styled('div')<{
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
  border: '1px solid black',
}));

type Props = {
  label: DraggableLabel;
  deleteLabel?: (labelId: string) => void;
  editLabel?: (el: DraggableLabel) => void;
};

const LabelPin = ({ label, deleteLabel, editLabel }: Props): JSX.Element => {
  const { permission } = useLocalContext();

  return (
    <Droppable droppableId={`${label.ind}`}>
      {(provided) => (
        <GroupContainer
          ref={provided.innerRef}
          {...provided.droppableProps}
          top={label.top}
          left={label.left}
        >
          {label.choices?.map((item, index) => (
            <Draggable key={item?.id} draggableId={item?.id} index={index}>
              {(dragProvided) => (
                <Label
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
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
                    {permission === PermissionLevel.Admin && (
                      <Box
                        display="flex"
                        sx={{
                          position: 'absolute',
                          top: -24,
                          right: -10,
                          display: 'none',
                          width: 'max-content',
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
                            onClick={() => editLabel(label)}
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
