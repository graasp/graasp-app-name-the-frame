import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { DraggableLabel } from '@/@types';
import { buildLabelActionsID } from '@/config/selectors';

const Label = styled('div')<{ isDraggable: boolean }>(
  ({ theme, isDraggable }) => ({
    background: theme.palette.primary.main,
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
  border: '1px solid white',
}));

type Props = {
  label: DraggableLabel;
  deleteLabel?: (labelId: string) => void;
  editLabel?: (el: DraggableLabel) => void;
  draggingOverItem?: boolean;
};

const LabelPin = ({
  label,
  deleteLabel,
  editLabel,
  draggingOverItem = true,
}: Props): JSX.Element => {
  const { permission } = useLocalContext();

  return (
    <Draggable draggableId={`droppable-${label.ind}`} index={label.ind}>
      {(allDroppableProvided) => (
        <GroupContainer
          ref={allDroppableProvided.innerRef}
          top={label.top}
          left={label.left}
          {...allDroppableProvided.dragHandleProps}
          {...allDroppableProvided.draggableProps}
          style={{
            ...allDroppableProvided.draggableProps.style,
            top: `${label.top}%`,
            left: `${label.left}%`,
            position: 'absolute',
          }}
        >
          <Droppable
            droppableId={`${label.ind}`}
            type="ITEM"
            isDropDisabled={!draggingOverItem}
            isCombineEnabled={false}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {label.choices?.map((item, index) => (
                  <Draggable
                    key={item?.id}
                    draggableId={item?.id}
                    index={index}
                    isDragDisabled={!draggingOverItem}
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editLabel(label);
                                  }}
                                >
                                  <Edit
                                    sx={{ color: 'white' }}
                                    fontSize="small"
                                  />
                                </IconButton>
                              )}
                              {deleteLabel && (
                                <IconButton
                                  sx={{
                                    padding: '4px',
                                    background: '#00000085',
                                    borderRadius: '50%',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteLabel(item.id);
                                  }}
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
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </GroupContainer>
      )}
    </Draggable>
  );
};

export default LabelPin;
