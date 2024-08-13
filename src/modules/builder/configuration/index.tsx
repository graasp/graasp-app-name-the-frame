import React, { useEffect, useRef, useState } from 'react';

import { Stack, Step, StepButton, Stepper } from '@mui/material';

import { Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  CONFIGURATION_TAB_ID,
  CONFIG_STEPPERS_ADD_IMG_ID,
  CONFIG_STEPPERS_ADD_LABELS_ID,
  CONFIG_STEPPERS_PREVIEW_ID,
} from '@/config/selectors';
import { APP } from '@/langs/constants';
import { ImageDimensionsProvider } from '@/modules/context/imageDimensionContext';

import AddImageStep from './AddImageStep';
import AddLabelsStep from './AddLabelsStep/AddLabelsStep';
import PreviewStep from './PreviewStep';

const Configurations = (): JSX.Element => {
  const { t } = useAppTranslation();

  const { data: imageSetting } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });
  const { data: settings } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const image = imageSetting?.[0];

  const settingsData = settings?.[0];
  const [activeStep, setActiveStep] = useState(0);

  const initialSetRef = useRef(false);

  useEffect(() => {
    // move to preview step in case all was settled, using Ref to move only within first render, So If i change sth with second step I don't want to move to preview immediately
    if (!initialSetRef.current && settingsData?.data?.labels) {
      initialSetRef.current = true;
      setActiveStep(2);
    }
  }, [settingsData]);

  const steps = [
    {
      label: t(APP.ADD_IMAGE_STEP_LABEL),
      component: <AddImageStep moveToNextStep={() => setActiveStep(1)} />,
      id: CONFIG_STEPPERS_ADD_IMG_ID,
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
      id: CONFIG_STEPPERS_ADD_LABELS_ID,
    },
    {
      label: t(APP.PREVIEW_STEP_LABEL),
      component: <PreviewStep moveToPrevStep={() => setActiveStep(1)} />,
      disabled: !settingsData?.data.labels || !image?.id,
      id: CONFIG_STEPPERS_PREVIEW_ID,
    },
  ];

  return (
    <Stack spacing={1} id={CONFIGURATION_TAB_ID}>
      <Stepper activeStep={activeStep} nonLinear>
        {steps.map(({ label, disabled, id }, index) => (
          <Step key={label}>
            <StepButton
              disabled={disabled}
              onClick={() => setActiveStep(index)}
              color="inherit"
              id={id}
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
