import { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

import { Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, styled } from '@mui/material';

import { Label } from '@/@types';
import { buildLabelActionsID } from '@/config/selectors';

type Props = {
  onStop: (position: { x: number; y: number }, labelId: string) => void;
  deleteLabel: (id: string) => void;
  editLabel: (id: string) => void;
  scale: number;
  setIsDragging: (b: boolean) => void;
  label: Label;
};

const StyledLabel = styled(Box)<{ labelId: string }>(({ theme, labelId }) => ({
  background: theme.palette.primary.main,
  color: 'white',
  borderRadius: theme.spacing(1),
  userSelect: 'none',
  padding: theme.spacing(0.5),
  position: 'absolute',
  cursor: 'grab',
  maxWidth: '12ch',
  '&:hover': {
    [`#${buildLabelActionsID(labelId)}`]: {
      display: 'inline-block',
    },
  },
  zIndex: 5,
}));

const DraggableLabel = ({
  onStop,
  deleteLabel,
  editLabel,
  scale,
  setIsDragging,
  label,
}: Props): JSX.Element => {
  const [position, setPosition] = useState({ x: label.x, y: label.y });

  const onDrag = (e: DraggableEvent, newP: DraggableData): void => {
    setIsDragging(true);
    e.stopPropagation();
    setPosition({ x: newP.x, y: newP.y });
  };

  return (
    <Draggable
      position={position}
      onDrag={onDrag}
      axis="none"
      onStop={(e: DraggableEvent) => {
        onStop(position, label.id);
        e.stopPropagation();
        e.preventDefault();
        setTimeout(() => {
          setIsDragging(false);
        }, 2000);
      }}
      scale={scale}
    >
      <StyledLabel labelId={label.id}>
        {label.content}
        <Box
          display="flex"
          id={buildLabelActionsID(label.id)}
          sx={{
            position: 'absolute',
            top: -24,
            right: -10,
            display: 'none',
            width: 'max-content',
          }}
        >
          <IconButton
            sx={{
              padding: '4px',
              background: '#00000085',
              borderRadius: '50%',
            }}
            onClick={(e) => {
              e.stopPropagation();
              editLabel(label.id);
            }}
          >
            <Edit sx={{ color: 'white' }} fontSize="small" />
          </IconButton>

          <IconButton
            sx={{
              padding: '4px',
              background: '#00000085',
              borderRadius: '50%',
            }}
            onClick={(e) => {
              e.stopPropagation();
              deleteLabel(label.id);
            }}
          >
            <Delete sx={{ color: 'white' }} fontSize="small" />
          </IconButton>
        </Box>
      </StyledLabel>
    </Draggable>
  );
};

export default DraggableLabel;
