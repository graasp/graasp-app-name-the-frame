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
import { LabelsProvider } from '@/modules/context/LabelsContext';
import { ImageDimensionsProvider } from '@/modules/context/imageDimensionContext';

import AddImageStep from './AddImageStep';
import AddLabelsStep from './AddLabelsStep/AddLabelsStep';
import PreviewStep from './PreviewStep';
import StepProvider, { useStepContext } from './StepContext';

const Configurations = (): JSX.Element => {
  const { t } = useAppTranslation();
  const { setActiveStep, activeStep } = useStepContext();

  const { data: imageSetting } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });
  const { data: settings } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.Settings,
  });

  const image = imageSetting?.[0];

  const settingsData = settings?.[0];

  const steps = [
    {
      labelKey: APP.ADD_IMAGE_STEP_LABEL,
      component: <AddImageStep />,
      id: CONFIG_STEPPERS_ADD_IMG_ID,
    },
    {
      labelKey: APP.ADD_LABELS_STEP_LABEL,
      component: (
        <ImageDimensionsProvider>
          <AddLabelsStep />
        </ImageDimensionsProvider>
      ),
      disabled: !image?.id,
      id: CONFIG_STEPPERS_ADD_LABELS_ID,
    },
    {
      labelKey: APP.PREVIEW_STEP_LABEL,
      component: <PreviewStep />,
      disabled: !settingsData?.data.labels || !image?.id,
      id: CONFIG_STEPPERS_PREVIEW_ID,
    },
  ];

  return (
    <Stack spacing={1} id={CONFIGURATION_TAB_ID}>
      <Stepper activeStep={activeStep} nonLinear>
        {steps.map(({ labelKey, disabled, id }, index) => (
          <Step key={labelKey}>
            <StepButton
              disabled={disabled}
              onClick={() => setActiveStep(index)}
              color="inherit"
              id={id}
            >
              {t(labelKey)}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {steps[activeStep].component}
    </Stack>
  );
};

const WrapperComponent = (): JSX.Element => (
  <StepProvider>
    <LabelsProvider>
      <Configurations />
    </LabelsProvider>
  </StepProvider>
);

export default WrapperComponent;
