import { useContext, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useControls } from 'react-zoom-pan-pinch';

import { Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, styled } from '@mui/material';

import { Label } from '@/@types';
import { buildLabelActionsID } from '@/config/selectors';
import { LabelsContext } from '@/modules/context/LabelsContext';

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

type Props = {
  openEditForm: (id: string) => void;
  label: Label;
};

const DraggableLabel = ({ openEditForm, label }: Props): JSX.Element => {
  const [position, setPosition] = useState({ x: label.x, y: label.y });
  const { labels, saveLabelsChanges, deleteLabel, setIsDragging } =
    useContext(LabelsContext);
  const { instance } = useControls();
  const { scale } = instance.transformState;

  const onDrag = (e: DraggableEvent, newP: DraggableData): void => {
    setIsDragging(true);
    e.stopPropagation();
    setPosition({ x: newP.x, y: newP.y });
  };

  const onStop = (e: DraggableEvent): void => {
    e.stopPropagation();
    e.preventDefault();

    const labelInd = labels.findIndex(({ id }) => id === label.id);
    if (labelInd > -1) {
      const newLabel = { ...label, ...position };
      saveLabelsChanges(labelInd, newLabel);
      setTimeout(() => {
        setIsDragging(false);
      }, 2000);
    }
  };
  return (
    <Draggable
      position={position}
      onDrag={onDrag}
      axis="none"
      onStop={onStop}
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
              openEditForm(label.id);
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
