import React, { useState } from 'react';

import { Stack, Step, StepButton, Stepper } from '@mui/material';

import { SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { CONFIGURATION_TAB_ID } from '@/config/selectors';
import { APP } from '@/langs/constants';

import AddImageStep from './AddImageStep';
import AddLabelsStep from './AddLabelsStep/AddLabelsStep';
import { ImageDimensionsProvider } from './AddLabelsStep/imageDimensionContext';
import PreviewStep from './PreviewStep/PreviewStep';

const Configurations = (): JSX.Element => {
  const { t } = useAppTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const { data: imageSetting } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });
  const { data: settings } = hooks.useAppSettings({
    name: SettingsKeys.SettingsData,
  });

  const image = imageSetting?.[0];

  const settingsData = settings?.[0];

  const steps = [
    {
      label: t(APP.ADD_IMAGE_STEP_LABEL),
      component: <AddImageStep moveToNextStep={() => setActiveStep(1)} />,
    },
    {
      label: t(APP.ADD_LABELS_STEP_LABEL),
      component: (
        <ImageDimensionsProvider>
          <AddLabelsStep
            moveToNextStep={() => setActiveStep(2)}
            moveToPrevStep={() => setActiveStep(0)}
          />
        </ImageDimensionsProvider>
      ),
      disabled: !image?.id,
    },
    {
      label: t(APP.PREVIEW_STEP_LABEL),
      component: <PreviewStep />,
      disabled: !settingsData?.data.labels || !image?.id,
    },
  ];

  return (
    <Stack spacing={1} id={CONFIGURATION_TAB_ID}>
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
