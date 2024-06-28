import React, { useState } from 'react';

import { Button, Stack } from '@mui/material';

import { Label, Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { APP } from '@/langs/constants';

import AddDraggableLabel from './AddDraggableLabel';

type Props = {
  moveToNextStep: () => void;
  moveToPrevStep: () => void;
};

const AddLabelsStep = ({
  moveToNextStep,
  moveToPrevStep,
}: Props): JSX.Element => {
  const { t } = useAppTranslation();

  const { data: appSettings } = hooks.useAppSettings<Settings>();
  const { mutate: patchSetting } = mutations.usePatchAppSetting();

  const image = appSettings?.find(({ name }) => name === SettingsKeys.File);
  const settingsData = appSettings?.find(
    ({ name }) => name === SettingsKeys.SettingsData,
  );

  const [labels, setLabels] = useState<Label[]>(
    settingsData?.data.labels || [],
  );

  const saveData = (): void => {
    if (settingsData) {
      const data = { ...settingsData.data, labels };
      patchSetting({ id: settingsData?.id, data });
    }

    moveToNextStep();
  };

  return (
    <Stack direction="row" flexWrap="wrap" spacing={2} padding={2}>
      {image && (
        <AddDraggableLabel
          imageSettingId={image?.id}
          labels={labels}
          setLabels={setLabels}
        />
      )}
      <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
        <Button size="large" onClick={moveToPrevStep}>
          {t(APP.BACK)}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={saveData}
          disabled={!settingsData?.data.labels && !labels.length}
        >
          {t(APP.NEXT)}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddLabelsStep;
