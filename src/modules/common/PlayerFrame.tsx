import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Box, Typography } from '@mui/material';

import { AnsweredLabel, Label } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { APP } from '@/langs/constants';
import { trackLabelsChanges } from '@/utils/dnd';

import AllLabelsContainer from './AllLabelsContainer';
import DraggableFrameWithLabels from './DraggableFrameWithLabels';

type Props = {
  labels: null | Label[];
  answeredLabels: AnsweredLabel[];
  isSubmitted?: boolean;
  onLabelMoved: (newLabels: Label[], newAnswers: AnsweredLabel[]) => void;
};

const PlayerFrame = ({
  labels,
  answeredLabels,
  isSubmitted = false,
  onLabelMoved,
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
          <Box
            sx={{
              position: 'relative',
              marginBottom: 2,
              width: '100%',
            }}
          >
            <AllLabelsContainer labels={labels} />
          </Box>
        )}
        <DraggableFrameWithLabels
          labels={answeredLabels}
          isDragging={isDragging}
          isSubmitted={isSubmitted}
        />
      </DragDropContext>
    </Box>
  );
};

export default PlayerFrame;
