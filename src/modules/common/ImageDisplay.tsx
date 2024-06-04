import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import FindReplaceIcon from '@mui/icons-material/FindReplace';
import { Box, Button, Stack } from '@mui/material';

import { useNameFrameTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { NAME_THE_FRAME } from '@/langs/constants';

const ImageDisplay = ({
  appSettingId,
}: {
  appSettingId: string;
}): JSX.Element => {
  const { t } = useNameFrameTranslation();

  const { data: dataFile } = hooks.useAppSettingFile({ appSettingId });
  const { mutate: deleteAppSettings } = mutations.useDeleteAppSetting();

  const deleteImage = (): void => {
    deleteAppSettings({ id: appSettingId });
  };

  return (
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
      {dataFile && (
        <Box
          sx={{
            width: '100%',
            height: '500px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <TransformWrapper initialScale={1}>
            <TransformComponent
              contentStyle={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={URL.createObjectURL(dataFile)}
                alt="frame"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                }}
              />
            </TransformComponent>
          </TransformWrapper>
        </Box>
      )}
    </Stack>
  );
};

export default ImageDisplay;
