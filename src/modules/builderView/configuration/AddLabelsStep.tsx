import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Button, Stack } from '@mui/material';

import {
  Choice,
  DraggableLabel,
  NameTheFrameSettings,
  NameTheFrameSettingsNames,
} from '@/@types';
import { useNameFrameTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { NAME_THE_FRAME } from '@/langs/constants';
import DraggableFrameWithLabels from '@/modules/common/DraggableFrameWithLabels';
import { move, reorder } from '@/utils/dnd';

type Props = {
  moveToNextStep: () => void;
  moveToPrevStep: () => void;
};

const AddLabelsStep = ({
  moveToNextStep,
  moveToPrevStep,
}: Props): JSX.Element => {
  const { t } = useNameFrameTranslation();

  const [labels, setLabels] = useState<DraggableLabel[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { data: appSettings } = hooks.useAppSettings<NameTheFrameSettings>();
  const { mutate: patchSetting } = mutations.usePatchAppSetting();

  const image = appSettings?.find(
    ({ name }) => name === NameTheFrameSettingsNames.File,
  );
  const settingsData = appSettings?.find(
    ({ name }) => name === NameTheFrameSettingsNames.SettingsData,
  );

  useEffect(() => {
    if (settingsData?.data.labels) {
      const draggableLabels = settingsData?.data.labels?.map(
        ({ top, left, id, content }, ind) => ({
          top,
          left,
          ind,
          labelId: id,
          choices: [{ content, id }],
        }),
      );

      setLabels(draggableLabels);
    }
  }, [settingsData?.data.labels]);

  const onDragStart = (): void => {
    setIsDragging(true);
  };

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

  const saveData = (): void => {
    const choices = labels.reduce(
      (acc: Choice[], curr) => [...acc, ...curr.choices],
      [],
    );
    const labelsWithPositions = choices.map((c) => {
      const choiceGroup = labels.find(({ labelId }) => labelId === c.id);
      if (choiceGroup) {
        const { top, left } = choiceGroup;
        return { ...c, top, left };
      }
      return c;
    });
    if (settingsData) {
      const data = { ...settingsData.data, labels: labelsWithPositions };
      patchSetting({ id: settingsData?.id, data });
    }

    moveToNextStep();
  };

  return (
    <Stack direction="row" flexWrap="wrap" spacing={2} padding={2}>
      {image && (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <DraggableFrameWithLabels
            isDragging={isDragging}
            imageSettingId={image.id}
            labels={labels}
            setLabels={setLabels}
          />
        </DragDropContext>
      )}
      <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
        <Button size="large" onClick={moveToPrevStep}>
          {t(NAME_THE_FRAME.BACK)}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={saveData}
          disabled={!settingsData?.data.labels && !labels.length}
        >
          {t(NAME_THE_FRAME.NEXT)}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddLabelsStep;
