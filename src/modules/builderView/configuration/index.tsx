import React, { useState } from 'react';

import { Stack, Step, StepButton, Stepper } from '@mui/material';

import { NameTheFrameSettings, NameTheFrameSettingsNames } from '@/@types';
import { useNameFrameTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { NAME_THE_FRAME } from '@/langs/constants';

import AddImageStep from './AddImageStep';
import AddLabelsStep from './AddLabelsStep';
import PreviewStep from './PreviewStep';

const Configurations = (): JSX.Element => {
  const { t } = useNameFrameTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const { data: appSettings } = hooks.useAppSettings<NameTheFrameSettings>();

  const image = appSettings?.find(
    ({ name }) => name === NameTheFrameSettingsNames.File,
  );

  const settingsData = appSettings?.find(
    ({ name }) => name === NameTheFrameSettingsNames.SettingsData,
  );

  const steps = [
    {
      label: t(NAME_THE_FRAME.ADD_IMAGE_STEP_LABEL),
      component: <AddImageStep moveToNextStep={() => setActiveStep(1)} />,
      disabled: false,
    },
    {
      label: t(NAME_THE_FRAME.ADD_LABELS_STEP_LABEL),
      component: (
        <AddLabelsStep
          moveToNextStep={() => setActiveStep(2)}
          moveToPrevStep={() => setActiveStep(0)}
        />
      ),
      disabled: !image?.id,
    },
    {
      label: t(NAME_THE_FRAME.PREVIEW_STEP_LABEL),
      component: <PreviewStep />,
      disabled: !settingsData?.data.labels || !image?.id,
    },
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
