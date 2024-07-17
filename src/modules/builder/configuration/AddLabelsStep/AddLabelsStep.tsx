import React, { useContext } from 'react';

import { Button, Stack } from '@mui/material';

import { useAppTranslation } from '@/config/i18n';
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
          disabled={!labels.length}
        >
          {t(APP.NEXT)}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddLabelsStep;
