import React from 'react';

import { Box } from '@mui/material';

import { useAppTranslation } from '@/config/i18n';
import { APP } from '@/langs/constants';

const AddLabelsStep = (): JSX.Element => {
  const { t } = useAppTranslation();
  return <Box>{t(APP.ADD_IMAGE_STEP_LABEL)}</Box>;
};

export default AddLabelsStep;
