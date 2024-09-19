import React, { useContext } from 'react';

import { Button, Stack } from '@mui/material';

import { useAppTranslation } from '@/config/i18n';
import { APP } from '@/langs/constants';
import { LabelsContext } from '@/modules/context/LabelsContext';

import { useStepContext } from '../StepContext';
import AddLabelWithinFrame from './AddLabelWithinFrame';

const AddLabelsStep = (): JSX.Element => {
  const { goToPrevStep, goToNextStep } = useStepContext();
  const { t } = useAppTranslation();

  const { labels } = useContext(LabelsContext);

  return (
    <Stack direction="row" flexWrap="wrap" spacing={2} padding={2}>
      <AddLabelWithinFrame />
      <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
        <Button
          size="large"
          onClick={() => {
            goToPrevStep();
          }}
        >
          {t(APP.BACK)}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            goToNextStep();
          }}
          disabled={!labels.length}
        >
          {t(APP.NEXT)}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddLabelsStep;
