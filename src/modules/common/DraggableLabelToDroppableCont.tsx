import { Draggable } from 'react-beautiful-dnd';

import { Clear } from '@mui/icons-material';
import { IconButton, Stack, styled } from '@mui/material';

import { Label } from '@/@types';
import { buildDraggableLabelId } from '@/config/selectors';

export const StyledLabel = styled('div')<{
  isDraggable: boolean;
  isSubmitted?: boolean;
  isCorrect?: boolean;
}>(({ theme, isDraggable, isSubmitted, isCorrect }) => ({
  color: 'white',
  borderRadius: theme.spacing(1),
  border: '1px solid white',
  padding: theme.spacing(1),

  ...(isDraggable
    ? {
        background: 'purple',
      }
    : {
        background: theme.palette.primary.main,
      }),
  ...(isSubmitted && {
    background: isCorrect
      ? theme.palette.success.main
      : theme.palette.error.main,
  }),
}));

export type DraggableLabelToDroppableContProps = {
  index: number;
  label: Label;
  content: string;
  isSubmitted?: boolean;
  isCorrect?: boolean;
  /**
   * whether the label can be dragged
   * usually labels inside the frame, that are set as an answer
   */
  isDragDisabled?: boolean;
  onRemoveLabel?: (label: Label) => void;
};
const DraggableLabelToDroppableCont = ({
  label,
  index,
  content,
  isSubmitted = false,
  isCorrect,
  isDragDisabled,
  onRemoveLabel,
}: DraggableLabelToDroppableContProps): JSX.Element => (
  <Draggable
    key={label.id}
    draggableId={label.id}
    index={index}
    isDragDisabled={isDragDisabled}
  >
    {(dragProvided, dragSnapshot) => (
      <Stack direction="row" alignItems="center">
        <StyledLabel
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          isDraggable={dragSnapshot.isDragging}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          id={buildDraggableLabelId(label.id)}
        >
          {content}
        </StyledLabel>
        {isDragDisabled && (
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => onRemoveLabel?.(label)}
          >
            <Clear fontSize="small" />
          </IconButton>
        )}
      </Stack>
    )}
  </Draggable>
);

export default DraggableLabelToDroppableCont;
