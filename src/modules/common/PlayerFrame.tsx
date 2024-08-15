import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Box, Typography } from '@mui/material';

import { AnsweredLabel, Label, Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import { trackLabelsChanges } from '@/utils/dnd';

import AllLabelsContainer from './AllLabelsContainer';
import DraggableFrameWithLabels from './DraggableFrameWithLabels';

const PlayerFrame = (): JSX.Element => {
  const { t } = useAppTranslation();

  const { data: appSettings } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const [answeredLabels, setAnsweredLabels] = useState<AnsweredLabel[]>([]);
  // labels will be null only before setting the state as we cannot render all labels within container if not settled yet
  const [labels, setLabels] = useState<null | Label[]>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const settingLabels = appSettings?.[0].data.labels;

    if (settingLabels) {
      const answered = settingLabels.map((label) => ({
        expected: label,
        actual: null,
      }));

      setAnsweredLabels(answered);
      setLabels(settingLabels);
    }
  }, [appSettings]);

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

    setLabels(l);
    setAnsweredLabels(newAnswers);
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
        />
      </DragDropContext>
    </Box>
  );
};

export default PlayerFrame;
