import { Alert, Box, Skeleton } from '@mui/material';

import { Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import { useImageDimensionsContext } from '@/modules/context/imageDimensionContext';

const ImageFrame = (): JSX.Element | null => {
  const { data: appSettings, isLoading: settingLoading } =
    hooks.useAppSettings<Settings>({ name: SettingsKeys.File });

  const image = appSettings?.[0];
  const appSettingId = image?.id || '';

  const { imgRef } = useImageDimensionsContext();
  const {
    data: dataFile,
    isLoading: isImageLoading,
    isError,
  } = hooks.useAppSettingFile({
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
          alt="app-frame"
          ref={imgRef}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
            pointerEvents: 'auto',
            width: '100%',
          }}
        />
      </Box>
    );
  }

  if (isImageLoading || settingLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return <Alert severity="error">{t(APP.UNEXPECTED_ERROR)}</Alert>;
  }

  return null;
};

export default ImageFrame;
