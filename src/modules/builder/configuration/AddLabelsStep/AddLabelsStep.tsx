import React from 'react';

import { Button, Stack } from '@mui/material';

import { Label, Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { APP } from '@/langs/constants';

import AddLabelWithinFrame from './AddLabelWithinFrame';

type Props = {
  moveToNextStep: () => void;
  moveToPrevStep: () => void;
};

const AddLabelsStep = ({
  moveToNextStep,
  moveToPrevStep,
}: Props): JSX.Element => {
  const { t } = useAppTranslation();

  const { data: settingsData } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });
  const { mutate: patchSetting } = mutations.usePatchAppSetting();

  const labels = settingsData?.[0]?.data.labels || [];

  const saveData = (l: Label[]): void => {
    if (settingsData) {
      const data = { ...settingsData?.[0]?.data, labels: l };
      patchSetting({ id: settingsData?.[0]?.id, data });
    }
  };

  return (
    <Stack direction="row" flexWrap="wrap" spacing={2} padding={2}>
      <AddLabelWithinFrame saveData={saveData} />
      <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
        <Button size="large" onClick={moveToPrevStep}>
          {t(APP.BACK)}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={moveToNextStep}
          disabled={!settingsData?.[0]?.data.labels && !labels.length}
        >
          {t(APP.NEXT)}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddLabelsStep;
