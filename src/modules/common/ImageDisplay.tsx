import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box } from '@mui/material';

import { hooks } from '@/config/queryClient';

type Props = {
  appSettingId: string;
};
const ImageDisplay = ({ appSettingId }: Props): JSX.Element | null => {
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
          />
        </TransformComponent>
      </TransformWrapper>
    </Box>
  ) : null;
};

export default ImageDisplay;
