import { useEffect, useState } from 'react';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { AnsweredLabel, Label, Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import PlayerFrame from '@/modules/common/PlayerFrame';

const PreviewStep = ({
  moveToPrevStep,
}: {
  moveToPrevStep: () => void;
}): JSX.Element => {
  const { t } = useAppTranslation();
  const { data: appContext } = hooks.useAppContext();

  const { data: appSettings } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const [answeredLabels, setAnsweredLabels] = useState<AnsweredLabel[]>([]);
  // labels will be null only before setting the state as we cannot render all labels within container if not settled yet
  const [labels, setLabels] = useState<null | Label[]>(null);

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
          <Typography variant="h5" fontWeight="bold">
            {appContext?.item.name}
          </Typography>
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
          <Button size="large" onClick={moveToPrevStep}>
            {t(APP.BACK)}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default PreviewStep;
