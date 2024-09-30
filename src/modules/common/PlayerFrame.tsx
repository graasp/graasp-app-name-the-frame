import { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Box, Typography } from '@mui/material';

import { AnsweredLabel, Label } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { APP } from '@/langs/constants';
import { trackLabelsChanges } from '@/utils/dnd';

import AllLabelsContainer from './AllLabelsContainer';
import DraggableFrameWithLabels from './DraggableFrameWithLabels';
import { DraggableLabelToDroppableContProps } from './DraggableLabelToDroppableCont';

type Props = {
  labels: null | Label[];
  answeredLabels: AnsweredLabel[];
  isSubmitted?: boolean;
  onLabelMoved: (newLabels: Label[], newAnswers: AnsweredLabel[]) => void;
  onRemoveLabel: DraggableLabelToDroppableContProps['onRemoveLabel'];
};

const PlayerFrame = ({
  labels,
  answeredLabels,
  isSubmitted = false,
  onLabelMoved,
  onRemoveLabel,
}: Props): JSX.Element => {
  const { t } = useAppTranslation();

  const [isDragging, setIsDragging] = useState(false);

  const onDragEnd = (draggable: DropResult): void => {
    const { source, destination: draggableDist } = draggable;

    setIsDragging(false);
    // dropped outside the list draggableDist
    if (!draggableDist || !labels) {
      return;
    }

    const srcDroppableId = source.droppableId;
    const distDroppableId = draggableDist.droppableId;
    const srcLabelIndex = source.index;
    const { labels: l, answeredLabels: newAnswers } = trackLabelsChanges({
      srcDroppableId,
      distDroppableId,
      labels,
      answeredLabels,
      srcLabelIndex,
    });

    onLabelMoved(l, newAnswers);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body1" fontWeight={500}>
        {t(APP.DRAG_DROP_EXERCISE_TITLE)}
      </Typography>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={() => setIsDragging(true)}
      >
        {labels && (
          <Box position="relative" mb={2}>
            <AllLabelsContainer labels={labels} isSubmitted={isSubmitted} />
          </Box>
        )}
        <DraggableFrameWithLabels
          labels={answeredLabels}
          isDragging={isDragging}
          isSubmitted={isSubmitted}
          onRemoveLabel={onRemoveLabel}
        />
      </DragDropContext>
    </Box>
  );
};

export default PlayerFrame;
