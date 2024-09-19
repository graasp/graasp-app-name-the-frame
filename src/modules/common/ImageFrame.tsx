import { Alert, Box, Skeleton } from '@mui/material';

import { SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';

const ImageFrame = (): JSX.Element | null => {
  const {
    data: image,
    isLoading: settingLoading,
    isError,
  } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });

  const appSettingId = image?.[0]?.id || '';

  const { data: dataFile, isLoading } = hooks.useAppSettingFile({
    appSettingId,
  });
  const { t } = useAppTranslation();

  if (dataFile) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        width="100%"
        height="100%"
      >
        <img
          src={URL.createObjectURL(dataFile)}
          alt="frame"
          style={{
            width: '100%',
            objectFit: 'cover',
            pointerEvents: 'auto',
            maxHeight: '100%',
          }}
        />
      </Box>
    );
  }

  if (isLoading || settingLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return <Alert severity="error">{t(APP.UNEXPECTED_ERROR)}</Alert>;
  }

  return null;
};

export default ImageFrame;
