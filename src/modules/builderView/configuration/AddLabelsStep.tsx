import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Box, Button } from '@mui/material';

import {
  Choice,
  NameTheFrameSettings,
  NameTheFrameSettingsNames,
  TipGroup,
} from '@/@types';
import { useNameFrameTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { NAME_THE_FRAME } from '@/langs/constants';
import DraggableFrameWithLabels from '@/modules/common/DraggableFrameWithLabels';
import LabelPin from '@/modules/common/LabelPin';
import { move, reorder } from '@/utils/dnd';

/*
Things to finalize:
- control react-pinch zoom to prevent over dragging (done)
- save data
- edit label

*/

const AddLabelsStep = (): JSX.Element => {
  const { t } = useNameFrameTranslation();

  const [labelGroups, setLabelGroups] = useState<TipGroup[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  const { data: appSettings } = hooks.useAppSettings<NameTheFrameSettings>();
  // const { mutate: postSetting } = mutations.usePostAppSetting();
  const { mutate: patchSetting } = mutations.usePatchAppSetting();

  const image = appSettings?.find(
    ({ name }) => name === NameTheFrameSettingsNames.File,
  );
  const settingsData = appSettings?.find(
    ({ name }) => name === NameTheFrameSettingsNames.SettingsData,
  );

  useEffect(() => {
    if (settingsData?.data.labels) {
      const choices = settingsData?.data.labels?.map(({ content, id }) => ({
        content,
        id,
      }));

      const labelsG = settingsData?.data.labels?.map(
        ({ top, left, id }, ind) => ({
          top,
          left,
          ind: ind + 1,
          labelId: id,
          choices: [],
        }),
      );

      const allLabels = [
        { top: '0%', left: '0%', choices, ind: 0, labelId: 'all-choices' },
        ...labelsG,
      ];

      setLabelGroups(allLabels);
    } else {
      setLabelGroups([
        { top: '0%', left: '0%', choices: [], ind: 0, labelId: 'all-choices' },
      ]);
    }
  }, [settingsData?.data.labels]);

  const onDragStart = (): void => {
    setIsDragging(true);
  };

  const onDragEnd = (result: DropResult): void => {
    const { source, destination } = result;
    setIsDragging(false);

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    // prevent drop to a filled destination
    const isDestinationFilled = labelGroups.find(
      ({ ind }) => dInd === ind && ind !== 0,
    )?.choices.length;

    if (isDestinationFilled) {
      return;
    }

    if (sInd === dInd) {
      const items = reorder(
        labelGroups[sInd].choices,
        source.index,
        destination.index,
      );
      const newState = [...labelGroups];
      newState[sInd].choices = items;
      setLabelGroups(newState);
    } else {
      const result5 = move(
        labelGroups[sInd].choices,
        labelGroups[dInd].choices,
        source,
        destination,
      );

      const newState = [...labelGroups];
      newState[sInd].choices = result5[sInd];
      newState[dInd].choices = result5[dInd];
      setLabelGroups(newState);
    }
  };

  const saveData = (): void => {
    const choices = labelGroups.reduce(
      (acc: Choice[], curr) => [...acc, ...curr.choices],
      [],
    );
    const labelsWithPositions = choices.map((c) => {
      const choiceGroup = labelGroups.find(({ labelId }) => labelId === c.id);
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
  };

  const deleteLabel = (labelIdToDelete: string): void => {
    const newGroups = labelGroups.filter(
      ({ labelId, ind }) => labelId !== labelIdToDelete && ind !== 0,
    );

    const newChoices = labelGroups[0].choices.filter(
      ({ id }) => id !== labelIdToDelete,
    );
    setLabelGroups([{ ...labelGroups[0], choices: newChoices }, ...newGroups]);
  };

  const editLabel = (labelId: string): void => {
    console.log(labelId);
  };

  return (
    <Box sx={{ paddingY: '48px' }}>
      {image && (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          {labelGroups.slice(0, 1).map((el) => (
            <LabelPin
              key={el.ind}
              el={el}
              deleteLabel={deleteLabel}
              editLabel={editLabel}
              // imageSize={{
              //   clientHeight: imageRef.current?.clientHeight || 0,
              //   clientWidth: imageRef.current?.clientWidth || 0,
              // }}
            />
          ))}
          <DraggableFrameWithLabels
            isDragging={isDragging}
            imageSettingId={image.id}
            labelGroups={labelGroups}
            setLabelGroups={setLabelGroups}
          />
        </DragDropContext>
      )}
      <Box alignSelf="end">
        <Button
          variant="contained"
          size="large"
          onClick={saveData}
          disabled={!image?.id}
        >
          {t(NAME_THE_FRAME.NEXT)}
        </Button>
      </Box>
    </Box>
  );
};

export default AddLabelsStep;
