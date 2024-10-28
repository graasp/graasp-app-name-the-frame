import { useContext, useRef } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { TokenContext, useLocalContext } from '@graasp/apps-query-client';
import { Loader } from '@graasp/ui';

import { Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks, notifier } from '@/config/queryClient';
import { DESCRIPTION_INPUT_ID } from '@/config/selectors';
import { APP } from '@/langs/constants';
import ImageDisplay from '@/modules/builder/ImageDisplay';
import UploadImage from '@/modules/common/UploadImage';
import { useSaveSettings } from '@/utils/useSaveSettings';

import { useStepContext } from './StepContext';

const AddImageStep = (): JSX.Element => {
  const { t } = useAppTranslation();
  const { itemId } = useLocalContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { goToNextStep } = useStepContext();
  const token = useContext(TokenContext);
  const { saveSettings, isLoading: isSaveSettingsLoading } = useSaveSettings();
  const { data: imageSetting } = hooks.useAppSettings();

  const {
    data: appSettings,
    isLoading,
    isSuccess,
  } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.Settings,
  });

  const image = imageSetting?.[0];
  const settings = appSettings?.[0]?.data;

  const saveData = async (): Promise<void> => {
    const newData = {
      ...(settings ?? {}),
      description: inputRef.current?.value,
    };
    try {
      await saveSettings(SettingsKeys.Settings, newData);
      goToNextStep();
    } catch (e) {
      console.error(e);
      notifier(t(APP.UNEXPECTED_ERROR));
    }
  };

  if (isSuccess) {
    return (
      <Stack spacing={2} padding={2}>
        <Box sx={{ marginTop: 3 }}>
          <InputLabel
            htmlFor={DESCRIPTION_INPUT_ID}
            sx={{ fontWeight: 500, color: 'black', fontSize: '1.25rem' }}
          >
            {t(APP.DESCRIPTION_LABEL)}
          </InputLabel>
          <Typography variant="body2" color="grey">
            {t(APP.DESCRIPTION_DETAILS)}
          </Typography>
          <TextField
            fullWidth
            defaultValue={settings?.description}
            placeholder={t(APP.DESCRIPTION_LABEL)}
            variant="outlined"
            inputRef={inputRef}
            multiline
            maxRows={3}
            id={DESCRIPTION_INPUT_ID}
            rows={3}
          />
        </Box>
        {image ? (
          <ImageDisplay appSettingId={image.id} />
        ) : (
          <Box>
            <Typography variant="h6">{t(APP.DROP_IMAGE_LABEL)}</Typography>
            <Typography variant="body2" color="grey">
              {t(APP.DROP_IMAGE_DESCRIPTION)}
            </Typography>
            {Boolean(token && itemId) && (
              <UploadImage token={token} itemId={itemId} />
            )}
          </Box>
        )}
        <Box alignSelf="end">
          <LoadingButton
            loading={isSaveSettingsLoading}
            variant="contained"
            size="large"
            onClick={saveData}
            disabled={!image?.id}
          >
            {t(APP.NEXT)}
          </LoadingButton>
        </Box>
      </Stack>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return <Alert severity="error">{t(APP.UNEXPECTED_ERROR)}</Alert>;
};

export default AddImageStep;
