import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Box, Typography } from '@mui/material';

import { DraggableLabelType, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import { move, reorder } from '@/utils/dnd';

import DraggableFrameWithLabels from './DraggableFrameWithLabels';
import DroppableDraggableLabel from './DroppableDraggableLabel';

type Props = {
  labels: DraggableLabelType[];
  setLabels: (l: DraggableLabelType[]) => void;
  isSubmitted?: boolean;
};
const PlayerFrame = ({
  labels,
  setLabels,
  isSubmitted = false,
}: Props): JSX.Element => {
  const { t } = useAppTranslation();
  const { data: image } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });

  const [isDragging, setIsDragging] = useState(false);

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
      {image && image?.length > 0 && (
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
            isSubmitted={isSubmitted}
          />
        </DragDropContext>
      )}
    </Box>
  );
};

export default PlayerFrame;
