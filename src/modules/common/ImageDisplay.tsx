/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box } from '@mui/material';

import { useNameFrameTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';

type Props = {
  appSettingId: string;
  onImageClick?: (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => void;
};
const ImageDisplay = ({
  appSettingId,
  onImageClick,
}: Props): JSX.Element | null => {
  const { t } = useNameFrameTranslation();

  const { data: dataFile } = hooks.useAppSettingFile({ appSettingId });

  return dataFile ? (
    <Box
      sx={{
        width: '100%',
        height: '500px',
        overflow: 'hidden',
        // position: 'relative',
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
              pointerEvents: 'auto',
            }}
            onClick={onImageClick}
          />
        </TransformComponent>
      </TransformWrapper>
    </Box>
  ) : null;
};

export default ImageDisplay;
