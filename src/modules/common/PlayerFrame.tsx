import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Box, Typography } from '@mui/material';

import { AnsweredLabel, Label, Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { ALL_DROPPABLE_CONTAINER_ID } from '@/config/selectors';
import { APP } from '@/langs/constants';
import { updateLabels } from '@/utils/dnd';

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

  const findAnLabelIndex = (id: string): number =>
    answeredLabels?.findIndex(({ expected }) => expected.id === id) ?? -1;

  const onDragEnd = (draggable: DropResult): void => {
    const { source, destination: draggableDist } = draggable;

    setIsDragging(false);
    // dropped outside the listdraggableDist
    if (!draggableDist || !labels) {
      return;
    }

    const srcDroppableId = source.droppableId;
    const distDroppableId = draggableDist.droppableId;

    // moving from all labels
    if (srcDroppableId === ALL_DROPPABLE_CONTAINER_ID) {
      const distIdx = findAnLabelIndex(distDroppableId);
      const labelDist = answeredLabels[distIdx];

      if (labelDist.actual) {
        return;
      }

      const sIdx = source.index;
      const itemToMove = labels[sIdx];
      const destination = { ...labelDist, actual: itemToMove };

      setAnsweredLabels(
        updateLabels(answeredLabels, [
          { index: distIdx, newItem: destination },
        ]),
      );
      setLabels(labels.filter((_, index) => index !== sIdx));
    }

    const srcIdx = findAnLabelIndex(srcDroppableId);

    // moving from answered labels
    if (srcIdx > -1) {
      const itemToMove = answeredLabels[srcIdx];
      const src = { ...itemToMove, actual: null };

      if (itemToMove.actual) {
        // move to all labels
        if (distDroppableId === ALL_DROPPABLE_CONTAINER_ID) {
          setAnsweredLabels(
            updateLabels(answeredLabels, [{ index: srcIdx, newItem: src }]),
          );
          setLabels([...labels, itemToMove.actual]);

          // move from choice to choice
        } else {
          const distIdx = findAnLabelIndex(distDroppableId);

          const dist = {
            ...answeredLabels[distIdx],
            actual: itemToMove.actual,
          };

          setAnsweredLabels(
            updateLabels(answeredLabels, [
              { index: distIdx, newItem: dist },
              { index: srcIdx, newItem: src },
            ]),
          );
        }
      }
    }
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
