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
  const { goToPrevStep } = useStepContext();

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

  const onRemoveLabel = (label: Label): void => {
    const newAnsweredLabels = answeredLabels.map((a) => {
      if (a?.actual?.id === label.id) {
        return { ...a, actual: null };
      }
      return a;
    });

    setLabels(labels.concat([label]));
    setAnsweredLabels(newAnsweredLabels);
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
          onRemoveLabel={onRemoveLabel}
        />
        <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
          <Button
            size="large"
            onClick={() => {
              goToPrevStep();
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
