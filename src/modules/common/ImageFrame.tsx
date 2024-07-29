import { styled } from '@mui/material';

import { hooks } from '@/config/queryClient';

type Props = {
  appSettingId: string;
};
const Container = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'baseline',
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0px',
  left: '0px',
}));

const ImageFrame = ({ appSettingId }: Props): JSX.Element | null => {
  const { data: dataFile } = hooks.useAppSettingFile({
    appSettingId,
  });

  return dataFile ? (
    <Container>
      <img
        src={URL.createObjectURL(dataFile)}
        alt="frame"
        style={{
          width: '100%',
          objectFit: 'cover',
          pointerEvents: 'auto',
          cursor: 'cell',
          maxHeight: '100%',
        }}
      />
    </Container>
  ) : null;
};

export default ImageFrame;
