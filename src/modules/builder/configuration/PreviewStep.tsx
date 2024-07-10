import { useEffect, useState } from 'react';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { DraggableLabelType, Settings, SettingsKeys } from '@/@types';
import { ADD_LABEL_FRAME_HEIGHT } from '@/config/constants';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import PlayerFrame from '@/modules/common/PlayerFrame';

const PreviewStep = ({
  moveToPrevStep,
}: {
  moveToPrevStep: () => void;
}): JSX.Element => {
  const { data: appContext } = hooks.useAppContext();

  const { data: appSettings } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const { t } = useAppTranslation();
  const [labels, setLabels] = useState<DraggableLabelType[]>([]);

  useEffect(() => {
    const appLabels = appSettings?.[0].data.labels;
    const imageDimension = appSettings?.[0].data.imageDimension;
    if (imageDimension) {
      const wStart = 0;
      const hStart = ADD_LABEL_FRAME_HEIGHT - imageDimension.height;
      if (appLabels) {
        const labelsP = appLabels.map((l, index) => ({
          labelId: l.id,
          ind: index + 1,
          choices: [],
          x: `${((l.x - wStart / 2) / imageDimension.width) * 100}%`,
          y: `${((l.y - hStart / 2) / imageDimension.height) * 100}%`,
        }));

        const allChoices = appLabels.map(({ id, content }) => ({
          id,
          content,
        }));

        const allLabels = [
          {
            ind: 0,
            y: '0%',
            x: '0%',
            labelId: 'all-labels',
            choices: allChoices,
          },
          ...labelsP,
        ];
        setLabels(allLabels);
      }
    }
  }, [appSettings]);

  return (
    <Stack spacing={2} padding={2}>
      <Alert severity="success">{t(APP.PREVIEW_NOTE)}</Alert>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          {appContext?.item.name}
        </Typography>
        <Typography variant="body1">
          {appSettings?.[0].data.description}
        </Typography>
      </Box>
      <PlayerFrame labels={labels} setLabels={setLabels} />
      <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
        <Button size="large" onClick={moveToPrevStep}>
          {t(APP.BACK)}
        </Button>
      </Stack>
    </Stack>
  );
};

export default PreviewStep;
