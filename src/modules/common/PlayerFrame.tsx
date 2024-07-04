import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Box, Typography } from '@mui/material';

import { DraggableLabelType, Settings, SettingsKeys } from '@/@types';
import {
  ADD_LABEL_FRAME_HEIGHT,
  ADD_LABEL_FRAME_WIDTH,
} from '@/config/constants';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import { move, reorder } from '@/utils/dnd';

import DraggableFrameWithLabels from './DraggableFrameWithLabels';
import DroppableDraggableLabel from './DroppableDraggableLabel';

const PlayerFrame = (): JSX.Element => {
  const { t } = useAppTranslation();
  const { data: image } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });

  const { data: appSettings } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const [labels, setLabels] = useState<DraggableLabelType[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const appLabels = appSettings?.[0].data.labels;
    const imageDimension = appSettings?.[0].data.imageDimension;
    if (imageDimension) {
      const wStart = ADD_LABEL_FRAME_WIDTH - imageDimension.width;
      const hStart = ADD_LABEL_FRAME_HEIGHT - imageDimension.height;
      if (appLabels) {
        const labelsP = appLabels.map((l, index) => ({
          labelId: l.id,
          ind: index + 1,
          choices: [],
          x: `${((l.x - wStart / 2) / imageDimension.width) * 100}%`,
          y: `${((l.y - hStart / 2) / imageDimension.height) * 100}%`,
        }));

        const allChoices = appLabels.map(({ id, content }) => ({
          id,
          content,
        }));

        const allLabels = [
          {
            ind: 0,
            y: '0%',
            x: '0%',
            labelId: 'all-labels',
            choices: allChoices,
          },
          ...labelsP,
        ];
        setLabels(allLabels);
      }
    }
  }, [appSettings]);

  const onDragEnd = (draggable: DropResult): void => {
    const { source, destination } = draggable;

    setIsDragging(false);
    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    // prevent drop to a filled destination
    const isDestinationFilled = labels.find(
      ({ ind }) => dInd === ind && ind !== 0,
    )?.choices.length;

    if (isDestinationFilled) {
      return;
    }

    if (sInd === dInd) {
      const items = reorder(
        labels[sInd].choices,
        source.index,
        destination.index,
      );
      const newState = [...labels];
      newState[sInd].choices = items;
      setLabels(newState);
    } else {
      const result = move(
        labels[sInd].choices,
        labels[dInd].choices,
        source,
        destination,
      );

      const newState = [...labels];
      newState[sInd].choices = result[sInd];
      newState[dInd].choices = result[dInd];
      setLabels(newState);
    }
  };

  return (
    <Box>
      <Typography variant="body1" fontWeight={500}>
        {t(APP.DRAG_DROP_EXERCISE_TITLE)}
      </Typography>
      {image?.length && (
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
            {labels.slice(0, 1).map((label) => (
              <DroppableDraggableLabel label={label} key={label.ind} />
            ))}
          </Box>
          <DraggableFrameWithLabels
            imageSettingId={image[0]?.id}
            labels={labels.slice(1)}
            isDragging={isDragging}
          />
        </DragDropContext>
      )}
    </Box>
  );
};

export default PlayerFrame;
