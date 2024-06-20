import React, { useState } from 'react';

import { Stack, Step, StepButton, Stepper } from '@mui/material';

import { SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';

import AddImageStep from './AddImageStep';
import AddLabelsStep from './AddLabelsStep';
import PreviewStep from './PreviewStep';

const Configurations = (): JSX.Element => {
  const { t } = useAppTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const { data: imageSetting } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });

  const image = imageSetting?.[0];

  const steps = [
    {
      label: t(APP.ADD_IMAGE_STEP_LABEL),
      component: <AddImageStep moveToNextStep={() => setActiveStep(1)} />,
    },
    {
      label: t(APP.ADD_LABELS_STEP_LABEL),
      component: <AddLabelsStep />,
      disabled: !image?.id,
    },
    { label: t(APP.PREVIEW_STEP_LABEL), component: <PreviewStep /> },
  ];

  return (
    <Stack spacing={1}>
      <Stepper activeStep={activeStep} nonLinear>
        {steps.map(({ label, disabled }, index) => (
          <Step key={label}>
            <StepButton
              disabled={disabled}
              onClick={() => setActiveStep(index)}
              color="inherit"
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {steps[activeStep].component}
    </Stack>
  );
};

export default Configurations;
