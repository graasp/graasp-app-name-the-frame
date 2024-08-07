import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Box, Typography } from '@mui/material';

import {
  AnsweredLabel,
  DraggableLabelType,
  Settings,
  SettingsKeys,
} from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import { updateLabels } from '@/utils/dnd';

import AllLabelsContainer from './AllLabelsContainer';
import DraggableFrameWithLabels from './DraggableFrameWithLabels';

const PlayerFrame = (): JSX.Element => {
  const { t } = useAppTranslation();

  const { data: appSettings } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const [labels, setLabels] = useState<AnsweredLabel[]>([]);
  const [nonAnsweredLabels, setNonAnsweredLabels] = useState<
    DraggableLabelType[]
  >([]);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const settingLabels = appSettings?.[0].data.labels;
    const imageDimension = appSettings?.[0].data.imageDimension;

    if (imageDimension) {
      if (settingLabels) {
        const answeredLabels = settingLabels.map(({ id, content, x, y }) => ({
          expected: {
            id,
            content,
            x: `${(x / imageDimension.width) * 100}%`,
            y: `${(y / imageDimension.height) * 100}%`,
          },
          actual: null,
        }));

        const AllChoices = settingLabels.map(({ id, content, x, y }) => ({
          id,
          content,
          x: `${(x / imageDimension.width) * 100}%`,
          y: `${(y / imageDimension.height) * 100}%`,
        }));

        setLabels(answeredLabels);
        setNonAnsweredLabels(AllChoices);
      }
    }
  }, [appSettings]);

  const onDragEnd = (draggable: DropResult): void => {
    const { source, destination: draggableDist } = draggable;

    setIsDragging(false);
    // dropped outside the list
    if (!draggableDist) {
      return;
    }
    const sInd = +source.index;
    const sDInd = +source.droppableId;
    const dInd = +draggableDist.droppableId;

    const labelDist = labels[dInd - 1];
    // moving from all items
    if (sDInd === 0) {
      if (labelDist.actual) {
        return;
      }

      const itemToMove = nonAnsweredLabels[sInd];
      const destination = { ...labelDist, actual: itemToMove };

      setLabels(
        updateLabels(labels, [{ index: dInd - 1, newItem: destination }]),
      );
      setNonAnsweredLabels(
        nonAnsweredLabels.filter((_, index) => index !== sInd),
      );
    }
    // moving from choices
    if (sDInd > 0) {
      const itemToMove = labels[sDInd - 1];
      const src = { ...itemToMove, actual: null };

      if (itemToMove.actual) {
        // move to all
        if (dInd === 0) {
          setLabels(updateLabels(labels, [{ index: sDInd - 1, newItem: src }]));
          setNonAnsweredLabels([...nonAnsweredLabels, itemToMove.actual]);

          // move from item to item
        } else {
          const dist = labels[dInd - 1];
          const destination = { ...dist, actual: itemToMove.actual };

          setLabels(
            updateLabels(labels, [
              { index: dInd - 1, newItem: destination },
              { index: sDInd - 1, newItem: src },
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
        <Box
          sx={{
            position: 'relative',
            marginBottom: 2,
            width: '100%',
          }}
        >
          <AllLabelsContainer labels={nonAnsweredLabels} />
        </Box>
        <DraggableFrameWithLabels labels={labels} isDragging={isDragging} />
      </DragDropContext>
    </Box>
  );
};

export default PlayerFrame;
