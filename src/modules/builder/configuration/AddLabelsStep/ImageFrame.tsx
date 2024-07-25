import { Alert, Skeleton, styled } from '@mui/material';

import { Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';

const Container = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0px',
  left: '0px',
}));

const ImageFrame = (): JSX.Element | null => {
  const { data: appSettings, isLoading: settingLoading } =
    hooks.useAppSettings<Settings>();

  const image = appSettings?.find(({ name }) => name === SettingsKeys.File);
  const appSettingId = image?.id || '';
  const {
    data: dataFile,
    isLoading,
    isError,
  } = hooks.useAppSettingFile({
    appSettingId,
  });

  const { t } = useAppTranslation();

  if (dataFile) {
    return (
      <Container>
        <img
          src={URL.createObjectURL(dataFile)}
          alt="frame"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
            pointerEvents: 'auto',
            cursor: 'cell',
          }}
        />
      </Container>
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
