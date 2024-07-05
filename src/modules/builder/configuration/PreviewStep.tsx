import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { Settings, SettingsKeys } from '@/@types';
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
      <PlayerFrame />
      <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
        <Button size="large" onClick={moveToPrevStep}>
          {t(APP.BACK)}
        </Button>
      </Stack>
    </Stack>
  );
};

export default PreviewStep;
