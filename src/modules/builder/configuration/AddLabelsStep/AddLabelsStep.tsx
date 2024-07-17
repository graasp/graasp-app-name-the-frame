import React, { useContext } from 'react';

import { Button, Stack } from '@mui/material';

import { Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import { LabelsContext } from '@/modules/context/LabelsContext';

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

  const { labels } = useContext(LabelsContext);

  return (
    <Stack direction="row" flexWrap="wrap" spacing={2} padding={2}>
      <AddLabelWithinFrame />
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
