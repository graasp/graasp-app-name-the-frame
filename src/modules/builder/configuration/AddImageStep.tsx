import React, { useContext, useEffect, useState } from 'react';

import {
  Box,
  Button,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Settings, SettingsKeys } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { DESCRIPTION_INPUT_ID } from '@/config/selectors';
import { APP } from '@/langs/constants';
import ImageDisplay from '@/modules/builder/ImageDisplay';
import UploadImage from '@/modules/common/UploadImage';
import { SettingsContext } from '@/modules/context/SettingsContext';

type Props = {
  moveToNextStep: () => void;
};
const AddImageStep = ({ moveToNextStep }: Props): JSX.Element => {
  const { t } = useAppTranslation();
  const { data: imageSetting } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });

  const { saveSettings } = useContext(SettingsContext);

  const { data: appSetting } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const image = imageSetting?.[0];
  const settings = appSetting?.[0];

  const [description, setDescription] = useState<string>('');

  const saveData = (): void => {
    const newData = { ...(settings && settings.data), description };

    saveSettings(SettingsKeys.SettingsData, newData);
    moveToNextStep();
  };

  useEffect(() => {
    if (settings?.data.description) {
      setDescription(settings?.data.description);
    }
  }, [settings]);

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
          value={description}
          placeholder={t(APP.DESCRIPTION_LABEL)}
          variant="outlined"
          onChange={(e) => setDescription(e.target.value)}
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
          <UploadImage />
        </Box>
      )}
      <Box alignSelf="end">
        <Button
          variant="contained"
          size="large"
          onClick={saveData}
          disabled={!image?.id}
        >
          {t(APP.NEXT)}
        </Button>
      </Box>
    </Stack>
  );
};

export default AddImageStep;
