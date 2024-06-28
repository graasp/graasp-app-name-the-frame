import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

import { Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, styled } from '@mui/material';

import { buildLabelActionsID } from '@/config/selectors';

type Props = {
  position: { x: number; y: number };
  onStop: (e: DraggableEvent, p: DraggableData) => void;
  content: string;
  labelId: string;
  deleteLabel: (id: string) => void;
  editLabel: (id: string) => void;
  scale: number;
  setIsDragging: (b: boolean) => void;
};

const Label = styled(Box)<{ labelId: string }>(({ theme, labelId }) => ({
  background: theme.palette.primary.main,
  color: 'white',
  borderRadius: theme.spacing(1),
  userSelect: 'none',
  padding: theme.spacing(0.5),
  position: 'absolute',
  cursor: 'grab',
  '&:hover': {
    [`#${buildLabelActionsID(labelId)}`]: {
      display: 'inline-block',
    },
  },
  zIndex: 5,
}));

const DraggableLabel = ({
  position,
  onStop,
  content,
  labelId,
  deleteLabel,
  editLabel,
  scale,
  setIsDragging,
}: Props): JSX.Element => (
  <Draggable
    position={position}
    onDrag={onStop}
    axis="none"
    onStop={() => {
      setTimeout(() => {
        setIsDragging(false);
      }, 2000);
    }}
    scale={scale}
  >
    <Label labelId={labelId}>
      {content}
      <Box
        display="flex"
        sx={{
          position: 'absolute',
          top: -24,
          right: -10,
          display: 'none',
          width: 'max-content',
        }}
        id={buildLabelActionsID(labelId)}
      >
        <IconButton
          sx={{
            padding: '4px',
            background: '#00000085',
            borderRadius: '50%',
          }}
          onClick={(e) => {
            e.stopPropagation();
            editLabel(labelId);
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
            deleteLabel(labelId);
          }}
        >
          <Delete sx={{ color: 'white' }} fontSize="small" />
        </IconButton>
      </Box>
    </Label>
  </Draggable>
);

export default DraggableLabel;
