import React, { useState } from 'react';

import FindReplaceIcon from '@mui/icons-material/FindReplace';
import {
  Box,
  Button,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { NameTheFrameSettingsNames } from '@/@types';
import { useNameFrameTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { DESCRIPTION_INPUT_ID } from '@/config/selectors';
import { NAME_THE_FRAME } from '@/langs/constants';
import ImageDisplay from '@/modules/common/ImageDisplay';
import UploadImage from '@/modules/common/UploadImage';

type Props = {
  moveToNextStep: () => void;
};
const AddImageStep = ({ moveToNextStep }: Props): JSX.Element => {
  const { t } = useNameFrameTranslation();
  const { data: appSettings } = hooks.useAppSettings();
  const { mutate: postSetting } = mutations.usePostAppSetting();
  const { mutate: patchSetting } = mutations.usePatchAppSetting();
  const { mutate: deleteAppSettings } = mutations.useDeleteAppSetting();

  const data = appSettings?.find(
    ({ name }) => name === NameTheFrameSettingsNames.SettingsData,
  );
  const image = appSettings?.find(
    ({ name }) => name === NameTheFrameSettingsNames.File,
  );

  const [description, setDescription] = useState(data?.data.description || '');

  const saveData = (): void => {
    const newData = { description };

    if (data?.id) {
      patchSetting({ id: data.id, data: newData });
    } else {
      postSetting({
        data: newData,
        name: NameTheFrameSettingsNames.SettingsData,
      });
    }
    moveToNextStep();
  };

  const deleteImage = (): void => {
    if (image?.id) {
      deleteAppSettings({ id: image?.id });
    }
  };

  return (
    <Stack spacing={2} padding={2}>
      <Box sx={{ marginTop: 3 }}>
        <InputLabel
          htmlFor={DESCRIPTION_INPUT_ID}
          sx={{ fontWeight: 500, color: 'black', fontSize: '1.25rem' }}
        >
          {t(NAME_THE_FRAME.DESCRIPTION_LABEL)}
        </InputLabel>
        <Typography variant="body2" color="grey">
          {t(NAME_THE_FRAME.DESCRIPTION_DETAILS)}
        </Typography>
        <TextField
          fullWidth
          value={description}
          placeholder={t(NAME_THE_FRAME.DESCRIPTION_LABEL)}
          variant="outlined"
          onChange={(e) => setDescription(e.target.value)}
          multiline
          maxRows={3}
          id={DESCRIPTION_INPUT_ID}
          rows={3}
        />
      </Box>
      {image ? (
        <Stack spacing={1}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<FindReplaceIcon />}
              onClick={deleteImage}
            >
              {t(NAME_THE_FRAME.REPLACE_IMAGE)}
            </Button>
          </Box>
          <ImageDisplay appSettingId={image.id} />
        </Stack>
      ) : (
        <Box>
          <Typography variant="h6">
            {t(NAME_THE_FRAME.DROP_IMAGE_LABEL)}
          </Typography>
          <Typography variant="body2" color="grey">
            {t(NAME_THE_FRAME.DROP_IMAGE_DESCRIPTION)}
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
          {t(NAME_THE_FRAME.NEXT)}
        </Button>
      </Box>
    </Stack>
  );
};

export default AddImageStep;
