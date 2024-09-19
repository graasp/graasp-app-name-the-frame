import { useEffect, useState } from 'react';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { AnsweredLabel, Label, Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import PlayerFrame from '@/modules/common/PlayerFrame';

import { useStepContext } from './StepContext';

const PreviewStep = (): JSX.Element => {
  const { t } = useAppTranslation();
  const { setActiveStep } = useStepContext();

  const { data: appSettings } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.Settings,
  });

  const [answeredLabels, setAnsweredLabels] = useState<AnsweredLabel[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    const settingLabels = appSettings?.[0].data.labels;

    if (settingLabels) {
      const answered = settingLabels.map((label) => ({
        expected: label,
        actual: null,
      }));

      setAnsweredLabels(answered);
      setLabels(settingLabels);
    }
  }, [appSettings]);

  const onLabelMoved = (
    newLabels: Label[],
    newAnswers: AnsweredLabel[],
  ): void => {
    setLabels(newLabels);
    setAnsweredLabels(newAnswers);
  };

  return (
    <>
      <Alert severity="success">{t(APP.PREVIEW_NOTE)}</Alert>
      <Stack spacing={2} padding={2}>
        <Box>
          <Typography variant="body1">
            {appSettings?.[0].data.description}
          </Typography>
        </Box>
        <PlayerFrame
          labels={labels}
          answeredLabels={answeredLabels}
          onLabelMoved={onLabelMoved}
        />
        <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
          <Button
            size="large"
            onClick={() => {
              setActiveStep(1);
            }}
          >
            {t(APP.BACK)}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default PreviewStep;
